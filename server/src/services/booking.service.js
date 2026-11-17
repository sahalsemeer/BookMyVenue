const { log } = require("node:console");
const { default: mongoose } = require("mongoose");
const {
  Roles,
  CANCEL_DAY_LIMIT,
  REFUND_PERCENTAGE,
} = require("../utils/constants");
const refundModel = require("../models/refund");

const createBooking = async ({ bookingDate, venueId, userId }) => {
  const venue = await venueModel.findById(venueId);
  if (!venue) {
    throw new Error("Venue Doesn't exists!");
  }
  const bookingExists = await bookingModel.findOne({
    venueId,
    bookingDate,
    status: "confirmed",
  });
  if (bookingExists) {
    throw new Error("Already booked on this date.");
  }
  const booking = new bookingModel({
    userId,
    venueId,
    bookingDate,
    amount: venue.price,
  });

  await booking.save();
  return booking;
};

const createPaymentOrder = async (bookingId, id) => {
  const booking = await bookingModel.findOne({
    userId: id,
    _id: bookingId,
  });
  if (!booking) {
    throw new Error("Booking doesn't exist!");
  }
  if (booking.status !== "pending") {
    throw new Error("Booking is no longer eligible for payment.");
  }
  const order = await razorpay.orders.create({
    amount: booking.amount * 100,
    currency: "INR",
    receipt: `BKD : ${booking._id.toString()}`,
  });

  console.log(order);

  await bookingModel.findByIdAndUpdate(bookingId, {
    orderId: order.id,
  });

  return { orderId: order.id, amount: order.amount, currency: order.currency };
};

const verifyPaymentOrder = async ({
  userId,
  bookingId,
  orderId,
  paymentId,
  signature,
}) => {
  const booking = await bookingModel.findOne({
    _id: bookingId,
    orderId,
    userId,
  });
  if (!booking) {
    throw new Error("Booking doesn't exist!");
  }

  if (booking.status !== "pending") {
    throw new Error("already booked!");
  }
  const hashedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  if (hashedSignature !== signature) {
    throw new Error("invalid credentials!");
  }
  booking.status = "confirmed";
  booking.paymentId = paymentId;

  await booking.save();
  return booking;
};

const getMyBookings = async (userId) => {
  return await bookingModel.find({ userId });
};

const getMyBookingsById = async (bookingId, userId) => {
  return await bookingModel.findOne({
    _id: bookingId,
    userId,
  });
};

const   cancelBookingByUser = async (userId, bookingId) => {
  const booking = await bookingModel.findOne(
    { _id: bookingId, userId, status: "confirmed" },
  );
  if (!booking) {
    throw new Error("Booking not found or access denied.!");
  }
  console.log(booking.status);

  const remaining = booking.bookingDate.getTime() - Date.now();

  if (remaining < CANCEL_DAY_LIMIT) {
    throw new Error("You can only cancel booking more than 3 days!");
  }

  const { paymentId } = booking;
  if (!paymentId) {
    throw new Error("PaymentId required!");
  }

  const refundAmount = Math.floor(
    booking.totalAmount * (REFUND_PERCENTAGE / 100) * 100,
  );
  const refund = await razorpay.payments.refunds(paymentId, {
    amount: refundAmount,
  });

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const refundDB = new refundModel({
      bookingId,
      paymentId,
      refundId: refund.id,
      amount: refund.amount,
      refundedAt: refund.created_at,
      status: refund.status,
    });
    await refundDB.save({ session });

    const updatedBooking = await bookingModel.findOneAndUpdate(
      {_id: bookingId, status:'confirmed'},
      {
        status: "cancelled",
        // cancelReason: reason,
        cancelledBy: Roles.CUSTOMER,
        cancelledAt: new Date(),
        refundId: refundDB._id,
      },
      {
        new: true,
        session,
      },
    );
    if (!updatedBooking) {
      throw new Error("Booking is already cancelled!");
    }

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }

  return { bookingId, refundId: refund.id, status: refund.status };
};

const getOwnerBooking = async (ownerId) => {
  const venuesId = await venueModel.find({ ownerId }).distinct("_id");
  console.log(venuesId);

  const bookings = await bookingModel
    .find({ venueId: { $in: venuesId } })
    .sort({ bookingDate: -1 });

  return bookings;
};

const getOwnerBookingByID = async (bookingId, ownerId) => {
  const booking = await bookingModel
    .findById(bookingId)
    .populate("venueId", "ownerId");

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.venueId.ownerId.toString() !== ownerId.toString()) {
    throw new Error("Unauthorized");
  }

  return booking;
};

const cancelBookingByOwner = async ({ bookingId, ownerId, reason }) => {
  const booking = await bookingModel
    .findById(bookingId)
    .populate("venueId", "ownerId");
  if (!booking) {
    throw new Error("Booking not found!");
  }
  if (!booking.venueId.ownerId.equals(ownerId)) {
    throw new Error("Auth Failed!");
  }
  if (booking.status !== "confirmed") {
    throw new Error("Only confirmed can cancelled!");
  }

  console.log(booking);

  //razorpay implemation
  const { paymentId } = booking;
  if (!paymentId) {
    throw new Error("Payment ID not found.");
  }
  const refund = await razorpay.payments.refund(paymentId);
  console.log(refund);

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const refundDB = new refundModel({
      bookingId,
      paymentId,
      refundId: refund.id,
      amount: refund.amount,
      refundedAt: refund.created_at,
      status: refund.status,
    });
    await refundDB.save({ session });
    const updateBooking = await bookingModel.findOneAndUpdate(
      { _id: bookingId, status: "confirmed" },
      {
        status: "cancelled",
        cancelReason: reason,
        cancelledBy: Roles.OWNER,
        cancelledAt: new Date(),
        refundId: refundDB._id,
      },
      { new: true, session },
    );
    if (!updateBooking) {
      throw new Error("Booking is already cancelled!");
    }
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }

  return {
    bookingId,
    refundId: refund.id,
    status: refund.status,
  };
};

module.exports = {
  createBooking,
  createPaymentOrder,
  verifyPaymentOrder,
  getMyBookings,
  getMyBookingsById,
  cancelBookingByUser,
  getOwnerBooking,
  getOwnerBookingByID,
  cancelBookingByOwner,
};

const { default: mongoose } = require("mongoose");
const bookingService = require("../services/booking.service");
const {
  validateBookingData,
  validateVerifyBookingData,
} = require("../utils/validate");
const { json } = require("express");

const createBooking = async (req, res, next) => {
  try {
    const bookingData = {
      userId: req.user.id,
      bookingDate: req.body.bookingDate,
      venueId: req.body.venueId,
    };
    console.log(bookingData);

    if (!validateBookingData(bookingData)) {
      return res
        .status(400)
        .json({ success: false, message: "Validation Failed!" });
    }

    const result = await bookingService.createBooking(bookingData);
    res.status(201).json({ success: true, booking: result });
  } catch (error) {
    next(error);
  }
};

const createPaymentOrder = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    const { id } = req.user;
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Booking ID!" });
    }
    const result = await bookingService.createPaymentOrder(bookingId, id);
    res.status(200).json({ success: true, booking: result });
  } catch (error) {
    next(error);
  }
};

const verifyPaymentOrder = async (req, res, next) => {
  try {
    const bookingData = {
      userId: req.user.id,
      bookingId: req.body.bookingId,
      paymentId: req.body.paymentId,
      orderId: req.body.orderId,
      signature: req.body.signature,
    };
    if (!validateVerifyBookingData(bookingData)) {
      return res
        .status(400)
        .json({ success: false, message: "invalid request" });
    }
    const result = await bookingService.verifyPaymentOrder(bookingData);
    res.status(200).json({ success: true, message: "Booking Success!" });
  } catch (error) {
    next(error);
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const bookings = await bookingService.getMyBookings(userId);
    if (!bookings) {
      return res
        .status(404)
        .json({ success: false, message: "No Bookings Found!" });
    }
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};

const getMyBookingsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: "false", message: "invalid request!" });
    }
    const booking = await bookingService.getMyBookingsById(id, userId);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found!" });
    }
    res.status(200).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

const cancelBookingByUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const bookingId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res
        .status(400)
        .json({ success: false, message: "invalid request!" });
    }
    const result = await bookingService.cancelBookingByUser(userId, bookingId);
    res
      .status(200)
      .json({
        success: true,
        message: "Booking Succesfully Cancelled!",
        data: result,
      });
  } catch (error) {
    next(error);
  }
};

// Owners
const getOwnerBooking = async (req, res, next) => {
  // recheck
  try {
    const ownerId = req.user.id;
    const ownerBooking = await bookingService.getOwnerBooking(ownerId);
    res.status(200).json({ success: true, booking: ownerBooking });
  } catch (error) {
    next(error);
  }
};

const getOwnerBookingByID = async (req, res, next) => {
  try {
    const bookingId = req.params.id;
    const ownerId = req.user.id;
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res
        .status(400)
        .json({ success: "false", message: "invalid request!" });
    }
    const booking = await bookingService.getOwnerBookingByID(
      bookingId,
      ownerId,
    );
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found!" });
    }
    res.status(200).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

const cancelBookingByOwner = async (req, res, next) => {
  try {
    const data = {
      bookingId: req.params.id,
      ownerId: req.user.id,
      reason: req.body.reason, // validate pending
    };
    if (!mongoose.Types.ObjectId.isValid(data.bookingId)) {
      return res
        .status(400)
        .json({ sucess: false, message: "invalid request" });
    }
    const cancel = await bookingService.cancelBookingByOwner(data);
    res
      .status(200)
      .json({
        success: true,
        result: { message: "Booking Cancelled Succesfully!", data: cancel },
      });
  } catch (error) {
    next(error);
  }
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

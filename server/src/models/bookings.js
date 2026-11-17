const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "venue",
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    orderId: {
      type: String,
    },
    paymentId: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "failed", "completed","cancelling"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "REFUNDED"],
    },
    cancelReason: {
      type: String,
    },
    cancelledBy: {
      type: String,
      enum: ["owner", "user"],
    },
    cancelledAt: {
      type: Date,
    },
    refundId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "refund",
    },
  },
  { timestamps: true },
);

bookingSchema.index({
  venueId: 1,
});

const bookingModel = mongoose.model("booking", bookingSchema);

module.exports = bookingModel;

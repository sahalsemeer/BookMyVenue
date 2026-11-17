const mongoose = require("mongoose");

const refundSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "booking",
    },
    refundId: {
        type: String,
        required: true,
    },
    paymentId: {
        type:String,
        required:true
    },
    amount: {
        type: Number,
        required: true,
    },
    status : {
        type:String,
        required :true
    },
    refundedAt: {
        type: Date,
        required: true,
    },
});

const refundModel = mongoose.model("refund", refundSchema);

module.exports = refundModel;

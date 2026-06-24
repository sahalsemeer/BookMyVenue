const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    photos: [String],
  },
  { timestamps: true },
);

venueSchema.index(
  {
    ownerId: 1,
    name: 1,
  },
  {
    unique: true,
  },
);

const venueModel = mongoose.model("venue", venueSchema);

module.exports = venueModel;

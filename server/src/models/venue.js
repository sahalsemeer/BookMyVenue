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
    bookingTypes: {
      type: [String],
      required: true,
      trim: true,
      lowercase: true,
      enum: ["hourly", "daily"],
    },
    availability: {
      workingDays: {
        type: [
          {
            type: String,
            enum: [
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
              "sunday",
            ],
          },
        ],
        required: true,
      },

      openingTime: {
        type: String,
        required: true,
      },

      closingTime: {
        type: String,
        required: true,
      },

      slotDuration: {
        type: Number,
        default: 60,
        min: 1,
      },
    },
    location: {
      type: String,
      required: true,
    },
    description: {
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
    pricePerHour: {
      type: Number,
      required: true,
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
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

// venueSchema.index({
//   ownerId:1
// })

const venueModel = mongoose.model("venue", venueSchema);

module.exports = venueModel;

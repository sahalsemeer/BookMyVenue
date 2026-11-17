const { default: mongoose } = require("mongoose");
const validator = require("validator");

function validate(req) {
  const { name, email, password } = req.body;

  if (validator.isEmpty(name)) {
    throw new Error("Invalid Name!");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid Email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password must be Strong!");
  }
  return true;
}

const allowedItems = [
  "name",
  "address",
  "description",
  "city",
  "state",
  "capacity",
  "price",
];

function UpdateVenueAllowedItems(data) {
  if (!data) return false;
  const userReq = Object.keys(data);
  if (userReq.length === 0) {
    return false;
  }
  return userReq.every((item) => allowedItems.includes(item));
}

function validateBookingData(data) {
  console.log(data);
  if (!data) return false;
  const { bookingDate, venueId, userId } = data;
  if (!bookingDate || !venueId) {
    return false;
  }
  if (!mongoose.Types.ObjectId.isValid(venueId)) {
     console.log("venueId");
    return false;
   
    
  }
  const date = new Date(bookingDate);
  console.log(date);
  
  if (isNaN(date.getTime())) {
     console.log("date");
    return false;

  }
  const today = new Date();
  const newBookingDate = new Date(bookingDate);
  today.setHours(0, 0, 0, 0);
  newBookingDate.setHours(0, 0, 0, 0);

  if (newBookingDate < today) {
     console.log("date comp");
    return false;
  }
  return true;
}

function validateVerifyBookingData(data) {
  const { bookingId, paymentId, orderId, signature } = data;
  if (!bookingId || !paymentId || !orderId || !signature) return false;
  if (!mongoose.Types.ObjectId.isValid(bookingId)) return false;
  return true;
}

module.exports = { validate, UpdateVenueAllowedItems, validateBookingData,validateVerifyBookingData};

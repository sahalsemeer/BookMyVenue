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

module.exports = { validate, UpdateVenueAllowedItems };

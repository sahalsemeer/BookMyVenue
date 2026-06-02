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

module.exports = validate;

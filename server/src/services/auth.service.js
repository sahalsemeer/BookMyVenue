const userModel = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async ({ name, email, password, role }) => {
    const existingMail = await userModel.findOne({ email });
    if (existingMail) {
        throw new Error("Email already exists!");
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const user = await userModel.create({
        name,
        email,
        password: hashedPass,
        role,
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    return {
        token,
        name,
        email,
        role,
    };
};

const login = async ({ email, password }) => {
    const user = await userModel.findOne({ email });
    if (!user) {
        throw new Error("Invalid Credentials!");
    }
    const isPass = await bcrypt.compare(password, user.password);
    if (!isPass) {
        throw new Error("Invalid Credentials!");
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    return {
        user,
        token,
    };
};

module.exports = {signup,login};

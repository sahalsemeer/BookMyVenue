const authService = require("../services/auth.service");
const validate = require("../utils/validate")

const signup = async (req, res, next) => {
    try {
        validate(req)
        const result = await authService.signup(req.body);
        res.cookie("token", result.token);
        return res
            .status(201)
            .json({ message: "User Created Succesfully!", user: result.user });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);
        res.cookie("token", result.token);
        return res.json({
            message: "User Logged in Succesfull!",
            user: result.user,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { signup, login };

const jwt = require("jsonwebtoken");
const userModel = require("../models/users");

const userAuth = async (req, res, next) => {
    try {
        // console.log(req.cookies);
        const { token } = req.cookies;
        
        
        if (!token) {
            return res.status(401).json({ message: "Token not Provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { id } = decoded;

        const user = await userModel.findById(id).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not exist" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error(error)
        res.status(401).json({ message: 'Unauthorized' });
    }
};



module.exports = {userAuth}

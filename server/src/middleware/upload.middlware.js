const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    // console.log(file);
    // console.log(file.mimetype);
    
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"), false);
    }
};


const upload = multer({
    storage,
    limits:{
        files:5,
        fileSize:5 * 1024 * 1024
    },
    fileFilter
})


module.exports = upload;
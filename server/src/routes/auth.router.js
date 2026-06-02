const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require('../models/users')
const validate = require('../utils/validate')
const router = express.Router()
const authController = require('../controllers/auth.controller')



router.post('/signup',authController.signup)
router.post('/login',authController.login)





module.exports = router;
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require('../models/users')
const validate = require('../utils/validate')
const Router = express.Router()
const authController = require('../controllers/auth.controller')



Router.post('/signup',authController.signup)
Router.post('/login',authController.login)





module.exports = Router;
const express = require('express');
const router = express.Router();
const {userAuth} = require('../middleware/auth.middleware')
const {authorize} = require('../middleware/role.middleware')
const bookingController = require('../controllers/booking.controller');
const Roles = require('../utils/constants')



//Customers
router.post('/booking',userAuth,authorize(Roles.CUSTOMER),bookingController.createBooking)
router.post('/payments/create-order',userAuth,authorize(Roles.CUSTOMER),bookingController.createPaymentOrder)
router.post('/payments/verify-order',userAuth,authorize(Roles.CUSTOMER),bookingController.verifyPaymentOrder)
router.get('/bookings',userAuth,authorize(Roles.CUSTOMER),bookingController.getMyBookings)
router.get('/bookings/:id',userAuth,authorize(Roles.CUSTOMER),bookingController.getMyBookingsById)
router.post('/bookings/:id/cancel',userAuth,authorize(Roles.CUSTOMER),bookingController.cancelBookingByUser)


//Owners
router.get('/my-bookings',userAuth,authorize(Roles.OWNER),bookingController.getOwnerBooking)
router.get('/my-bookings/:id',userAuth,authorize(Roles.OWNER),bookingController.getOwnerBookingByID)
router.post('/my-bookings/:id/cancel',userAuth,authorize(Roles.OWNER),bookingController.cancelBookingByOwner)



module.exports = router;
const express = require('express')
const router = express.Router()
const venueController = require('../controllers/venue.controller')
const {userAuth} = require('../middleware/auth.middleware')
const {authorize} = require('../middleware/role.middleware')
const Roles = require('../utils/constants')
const upload = require('../middleware/upload.middlware')


//users
router.get('/venues',venueController.getVenues)
router.get('/venues/:id',venueController.getVenuesByID)

//venue owner
router.post('/venue',userAuth,authorize(Roles.OWNER),upload.array('photos',5),venueController.createVenue)
router.get('/myVenues',userAuth,authorize(Roles.OWNER),venueController.getMyVenues)
router.get('/myVenues/:id',userAuth,authorize(Roles.OWNER),venueController.getMyVenuesByID)
router.patch('/myVenues/:id',userAuth,authorize(Roles.OWNER),venueController.updateVenue)
router.delete('/myVenues/:id',userAuth,authorize(Roles.OWNER),venueController.deleteVenue)


module.exports = router;

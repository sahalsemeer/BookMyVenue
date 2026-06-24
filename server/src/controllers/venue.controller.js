const mongoose = require("mongoose");
const venueService = require("../services/venue.service");
const venueModel = require("../models/venue");
const { UpdateVenueAllowedItems } = require("../utils/validate");

// customer
const getVenues = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = 5;
    const result = await venueService.getVenues(page, limit);
    return res.json({
      message: "Venues Listed!",
      venue: result.venue,
      totalPages: result.totalPages,
      page: result.page,
      limit: result.limit,
      totalVenues: result.totalVenues,
    });
  } catch (error) {
    next(error);
  }
};

const getVenuesByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Venue ID" });
    }
    const result = await venueService.getVenuesByID(id);
    if (!result) {
      return res.status(404).json({ message: "Venue Not Found!" });
    }
    return res.json({ message: "venue listed!", venue: result });
  } catch (error) {
    next(error);
  }
};

//venue owner

const createVenue = async (req, res, next) => {
  try {
    // console.log(req.files);
    // console.log(req.body);
    const result = await venueService.createVenue(
      req.body,
      req.user.id,
      req.files,
    );
    return res.status(201).json({ success: true, venue: result.venue });
  } catch (error) {
    next(error);
  }
};

const getMyVenues = async (req, res, next) => {
  try {
    const venues = await venueService.getMyVenues(req.user.id);
    return res.json({ success: true, venues });
  } catch (error) {
    next(error);
  }
};

const getMyVenuesByID = async (req, res, next) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Venue ID!" });
    }
    const venue = await venueService.getMyVenuesByID(req.params.id);
    if (!venue) {
      return res
        .status(404)
        .json({ succes: false, message: "Venue Not Found!" });
    }
    return res.json({ success: true, venue });
  } catch (error) {
    next(error);
  }
};

const updateVenue = async (req, res, next) => {
  try {
    const venueID = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(venueID)) {
      return res
        .status(400)
        .json({ success: false, message: "invalid venueId!" });
    }

    const validateAllowedItems = UpdateVenueAllowedItems(req.body);
    if (!validateAllowedItems) {
      return res
        .status(400)
        .json({ success: false, message: "update cant be done!" });
    }
    const updatedVenue = await venueService.updateVenue(
      venueID,
      req.body,
      req.user.id,
    );
    // console.log(updatedVenue);

    if (!updatedVenue) {
      return res.status(403).json({
        success: false,
        message: "You're not allowed to update data!",
      });
    }
    return res.status(200).json({ success: true, data: updatedVenue });
  } catch (error) {
    next(error);
  }
};

const deleteVenue = async (req, res, next) => {
  try {
    const venueId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(venueId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid VenueId!" });
    }
    const result = await venueService.deleteVenue(venueId, req.user.id);
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Venue not found!" });
    }
    return res.status(200).json({ success: true, message: "venue deleted!" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVenues,
  getVenuesByID,
  createVenue,
  getMyVenues,
  getMyVenuesByID,
  updateVenue,
  deleteVenue,
};

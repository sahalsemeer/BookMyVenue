const { default: mongoose } = require("mongoose");
const venueModel = require("../models/venue");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// console.log(photoUrls);

  //using for loop
  // const photoUrls = []
  // for (let file of files){
  //   console.time(file.originalname)
  //     console.log(
  //     file.originalname,
  //     (file.size / 1024 / 1024).toFixed(2) + " MB")
  //   const result = await uploadToCloudinary(file.buffer);
  //   console.timeEnd(file.originalname)
  //   photoUrls.push(result.secure_url)
  // }

  
//customers
const getVenues = async (page, limit) => {
  const skip = (page - 1) * limit;
  const totalVenues = await venueModel.countDocuments();
  const totalPages = Math.ceil(totalVenues / limit);
  const venue = await venueModel
    .find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
  return {
    venue,
    page,
    limit,
    totalVenues,
    totalPages,
  };
};

const getVenuesByID = async (id) => {
  return await venueModel.findById(id);
};

//venueOwners
const createVenue = async (venueData, ownerId, files) => {
  console.log(files);
  // using promise.all();
  const uploadPromises = files.map(async (file) => {
    console.log(file.originalname, (file.size / 1024 / 1024).toFixed(2) + "MB");
    console.time(file.originalname);
    const result = await uploadToCloudinary(file.buffer);
    console.timeEnd(file.originalname);
    return result;
  });
  const results = await Promise.all(uploadPromises);
  console.timeEnd("upload");
  const photoUrls = results.map((file) => file.secure_url);
  const existingVenue = await venueModel.findOne({
    ownerId,
    name: venueData.name,
  });
  if (existingVenue) {
    throw new Error("Venue Alredy Exists!");
  }
  const venue = await venueModel.create({
    ownerId,
    ...venueData,
    photos: photoUrls,
  });
  return { venue };
};

const getMyVenues = async (id) => {
  // console.log(id);
  return await venueModel.find({ ownerId: id }).sort({ createdAt: -1 }).lean();
};

const getMyVenuesByID = async (venueId) => {
  return await venueModel.findById(venueId);
};

const updateVenue = async (venueId, newVenueData, ownerId) => {
  return await venueModel.findOneAndUpdate(
    { _id: venueId, ownerId },
    {
      $set: newVenueData,
    },
    { new: true, runValidators: true },
  );
};

const deleteVenue = async (venueId, ownerId) => {
  return await venueModel.findOneAndDelete({ _id: venueId, ownerId });
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

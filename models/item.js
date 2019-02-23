const mongoose = require('mongoose');

module.exports = mongoose.model(
  'Item',
  // Define your model schema below:
  mongoose.Schema({
    title: {
      type: String,
      required: "Title is required"
    },
    description: {
      type: String,
      required: "Description is required"
    },
    imageUrl: {
      type: String,
      required: "Image URL is required"
    },
    _id: {
      type: Number
    }
  })
);

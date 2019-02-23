const mongoose = require('mongoose');

module.exports = mongoose.model(
  'Counter',
  mongoose.Schema({
    _id: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  })
);
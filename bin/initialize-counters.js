#!/usr/bin/env node

const {mongoose, databaseUrl, options} = require('../database');
const Counter = require('../models/counter');

const initialize = async () => {
  await mongoose.connect(databaseUrl, options);
  const itemCounter = {
    _id: "items",
    value: 1
  };
  
  await Counter.create(itemCounter);
}

initialize()
  .then(() => {
    console.log('Initialized counters successfully');
    process.exit(0);
  })
  .catch(err => {
    console.log('Initializing counters unsuccessful');
    throw err;
    process.exit(1);
});
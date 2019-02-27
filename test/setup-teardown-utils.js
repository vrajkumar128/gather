const {mongoose, databaseUrl, options} = require('../database');

const Counter = require('../models/counter');

const connectDatabaseAndDropData = async () => {
  await mongoose.connect(databaseUrl, options);
  await mongoose.connection.db.dropDatabase();
};

const disconnectDatabase = async () => {
  await mongoose.disconnect();
};

module.exports = {
  connectDatabaseAndDropData,
  disconnectDatabase,
};

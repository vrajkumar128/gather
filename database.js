const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Counter = require('./models/counter');

const env = process.env.NODE_ENV || 'development';
const databaseUrl = process.env.DATABASE_URL || `mongodb://localhost/gather_${env}`;
const options= {
  useMongoClient: true,
};

const getCounter = async (name) => {
  if (await Counter.findOne({ _id: name }) === null) {
    await Counter.create({ _id: name, value: 1 });
  }

  document = await Counter.findOneAndUpdate({ _id: name }, { $inc: { value: 1 } });
  return document.value;
};

module.exports = {
  mongoose,
  databaseUrl,
  options,
  getCounter
};

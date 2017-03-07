const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const buoySchema = new Schema({
  buoyName: String,
  latitude: Number,
  longitude: Number,
  stationID: Number,
  waterLevelMax : Number,
  waterLevelMin: Number

});

const Buoy = mongoose.model('buoyes', buoySchema);

module.exports = Buoy;

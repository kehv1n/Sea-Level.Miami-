const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const buoySchema = new Schema({
    buoyName: String,
    loc: {
        type: [Number], ///LATITUDE LONGITUDE GO HERE
        index: '2d' ///TYPE OF GEOSPACIAL QUERY (FLAT)
    },
    stationID: Number,
    waterLevelMax: Number,
    waterLevelMin: Number

});

const Buoy = mongoose.model('buoyes', buoySchema);

module.exports = Buoy;

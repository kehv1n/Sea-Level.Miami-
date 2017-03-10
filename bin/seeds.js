const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);
const Buoy = require('../models/buoy.js');

const buoys = [{
        buoyName: "Lake Worth Pier, FL ",
        loc: [-80.035000, 26.613333],
        // latitude: 25.903333,
        // longitude: -80.120000,
        stationID: 8722670,

    },
    {
        buoyName: "Vaca Key, FL",
        loc: [ -81.106667, 24.711667],
        // latitude: 25.778333,
        // longitude:  -80.185000,
        stationID: 8723970
    },
    {
        buoyName: "Key West, FL",
        loc: [-81.808333, 24.600000],
        // latitude: 25.763333,
        // longitude: -80.13000,
        stationID: 8724580
    },
    {
        buoyName: "Virginia Key, FL",
        loc: [-80.161667, 25.731667],
        // latitude: 25.731667,
        // longitude: -80.161667,
        stationID: 8723214

    },
    {
        buoyName: "Naples, FL",
        loc: [-81.806667, 26.131667],
        // latitude: 25.615000,
        // longitude: -80.305000,
        stationID: 8725110
    },
    {
        buoyName: "Fort Myers, FL",
        loc: [ -81.87000, 26.648333],
        // latitude: 25.615000,
        // longitude: -80.305000,
        stationID: 8725520
    },
    {
        buoyName: "Port Manatee, FL",
        loc: [ -82.563333, 27.638333],
        // latitude: 25.615000,
        // longitude: -80.305000,
        stationID: 8726384
    },
    {
        buoyName: "Trident Pier, FL",
        loc: [ -80.593333, 28.415000],
        // latitude: 25.615000,
        // longitude: -80.305000,
        stationID: 8721604
    },
];

Buoy.create(buoys, (err, info, next) => {
    if (err) {
        throw err;
    }

    mongoose.disconnect();
});

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tides-app');
const Buoy = require('../models/buoy.js');

const buoys = [{
        buoyName: "HAULOVER PIER, N. MIAMI BEACH, FL ",
        latitude: 25.903333,
        longitude: -80.120000,
        stationID: 8723080,
        waterLevelMax: 1.77,
        waterLevelMin: -1.41

    },
    {
        buoyName: "MIAMI, BISCAYNE BAY, FL",
        latitude: 25.778333,
        longitude:  -80.185000,
        stationID: 8723165,
        waterLevelMax: 1.25,
        waterLevelMin: -1.13,
    },
    {
        buoyName: "MIAMI BEACH, GOVERNMENT CUT, FL",
        latitude: 25.763333,
        longitude: -80.13000,
        stationID: 8723178,
        waterLevelMax: 1.23,
        waterLevelMin: -1.34 ,
    },
    {
        buoyName: "Virginia Key, FL",
        latitude: 25.731667,
        longitude: -80.161667,
        stationID: 8723214,
        waterLevelMax: 2.57,
        waterLevelMin: -1.31 ,
    },
    {
        buoyName: "CUTLER, BISCAYNE BAY, FL",
        latitude: 25.615000,
        longitude: -80.305000,
        stationID: 8723289,
        waterLevelMax: 1.32,
        waterLevelMin: -1.41,
    },
];

Buoy.create(buoys, (err, info, next) => {
    if (err) {
        throw err;
    }

    mongoose.disconnect();
});

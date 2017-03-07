const express = require('express');
const indexRoute = express.Router();
var NodeGeocoder = require('node-geocoder');

/* GET home page. */
indexRoute.get('/', (req, res, next) => {
    res.render('index', {
        title: "Landing"
    });
});

var options = {
    provider: 'google',

    // Optional depending on the providers
    // httpAdapter: 'https', // Default
    apiKey: process.env.GMAPS_API, // for Mapquest, OpenCage, Google Premier
    // formatter: null         // 'gpx', 'string', ...
};

var geocoder = NodeGeocoder(options);


indexRoute.post('/dashboard', (req, res, next) => {
    const userZip = req.body.zipcode;

    if (userZip === '') { ////NO ERROR MESSAGE YET
        res.render('index', {
            errorMessage: "Please enter zip code to continue.."
        });
        return;
    }
    geocoder.geocode(userZip, function(err, geocodeResult) {
        if (err) {
            next(err);
            return;
        }
        const latitude = geocodeResult[0].latitude;
        const longitude = geocodeResult[0].longitude;

        res.render('dashboard', {
            zipcode: userZip,
            latitude: latitude,
            longitude: longitude,
        });
    });
});

module.exports = indexRoute;

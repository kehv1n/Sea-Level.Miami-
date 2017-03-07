const express = require('express');
const indexRoute = express.Router();
var NodeGeocoder = require('node-geocoder');
const Buoy = require('../models/buoy.js');

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
    /// TURNS USER ZIP TO LAT LONG /////
    geocoder.geocode(userZip, function(err, geocodeResult) {
        if (err) {
            next(err);
            return;
        }
        const latitude = geocodeResult[0].latitude;
        const longitude = geocodeResult[0].longitude;

        const userCoords = [longitude, latitude];
        // Using the user's coords find the closes
        // Buoy by its coords
        Buoy.findOne({
            loc: {
                $near: userCoords
            }
        }, (err, buoys) => {
            if (err) {
                next(err);
                return;
            }
            res.render('dashboard',
             {
                zipcode: userZip,
                coords: userCoords,
                buoyID: buoys.stationID,
                buoyName: buoys.buoyName
            });

        });
    });
});

module.exports = indexRoute;

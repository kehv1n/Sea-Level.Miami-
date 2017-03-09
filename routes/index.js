const express = require('express');
const indexRoute = express.Router();
var NodeGeocoder = require('node-geocoder');
const Buoy = require('../models/buoy.js');
const request = require('request');

// $(document).scroll(function() {
//   var scrollTop = $('html').scrollTop();
//   if(scrollTop < 150) {
//     $(".intro-section").fadeIn();
//   }
//   else {
//     $(".intro-section").fadeOut();
//   }
// });


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
            const day = new Date ();
            let dd = day.getDate();
            let mm = day.getMonth() +1 ; //Starts at 0
            const yy = day.getFullYear();

            if(mm < 10) {
              mm = '0'+mm;
            }
            if(dd < 10) {
              dd = '0'+dd;
            }

            const today = `${yy}${mm}${dd}`;

            const link = `https://tidesandcurrents.noaa.gov/api/datagetter?station=${buoys.stationID}&product=water_level&time_zone=gmt&format=json&begin_date=${today}&end_date=${today}&units=metric&datum=msl`;
            ///Returns live data from Buoy////
            request(link, function(error, response, body) {
              if (error) {
                next(error);
                return;
              }

              res.render('dashboard', {
                zipcode: userZip,
                coords: userCoords,
                buoyID: buoys.stationID,
                buoyName: buoys.buoyName,
                buoyData: body

            });

            });

        });
    });
});

indexRoute.get('/login', (req, res, next) => { ///////////LOGIN PAGE
  res.render('login');
});

indexRoute.get('/register', (req, res, next) => { ///////////?REGISTER PAGE
  res.render('register');
});




module.exports = indexRoute;

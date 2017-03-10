const express = require('express');
const indexRoute = express.Router();
const NodeGeocoder = require('node-geocoder');
const Buoy = require('../models/buoy.js');
const request = require('request');
const User = require('../models/users.js');
const passport = require('passport');
// const chart = require('chart.js');

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


/* GET home page. */
indexRoute.get('/', (req, res, next) => {
    res.render('index', {
        title: "Landing",
        successMessage: req.flash('success')
    });
});

/// GOOGLE API ACTION

var options = {
    provider: 'google',
    apiKey: process.env.GMAPS_API,
};

var geocoder = NodeGeocoder(options);

/* POST DASHBOARD */
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

        Buoy.findOne({ loc: { $near: userCoords } }, (err, buoys) => {
            if (err) {
                next(err);
                return;
            }
            const day = new Date();
            let dd = day.getDate();
            let mm = day.getMonth() + 1; //Starts at 0
            const yy = day.getFullYear();

            if (mm < 10) {
                mm = '0' + mm;
            }
            if (dd < 10) {
                dd = '0' + dd;
            }

            //DATE USER MAKES POST REQ
            const today = `${yy}${mm}${dd}`;

            const link = `https://tidesandcurrents.noaa.gov/api/datagetter?station=${buoys.stationID}&product=water_level&time_zone=gmt&format=json&begin_date=${today}&end_date=${today}&units=metric&datum=msl`;
            const link4Years = `https://tidesandcurrents.noaa.gov/api/datagetter?product=monthly_mean&application=NOS.COOPS.TAC.WL&station=${buoys.stationID}&begin_date=20160101&end_date=${today}&datum=MSL&units=english&time_zone=GMT&format=json`;

            // const link = `https://tidesandcurrents.noaa.gov/api/datagetter?`
            // + `station=${buoys.stationID}`
            // + `product=water_level&`
            // + `time_zone=gmt&`
            // + `format=json&`
            // + `date=today&`
            // + `units=metric&`
            // + `datum=msl`


            ///Returns live data from Buoy////
            request(link, function(error, response, body) {
                if (error) {
                    next(error);
                    return;
                }
                const parsedTimes = [];
                const parsedLevels = [];
                //Parse the JSON FILES WITH THE data
                //We want to have

                JSON.parse(body, (name, value) => {
                    if (name === 't') {
                        parsedTimes.push(value);
                        return;

                    }
                    if (name === 'v') {
                        parsedLevels.push(value);
                        return;
                    } else {
                        return undefined;
                    }

                });

                sixMinsAgo = new Date(day);
                sixMinsAgo.setMinutes(sixMinsAgo.getMinutes() - 6);

                //Turn the string of "dates" to actual dates
                let currentSeaLevel;
                parsedTimes.forEach((time, index) => {
                    let eachTime = new Date(time);
                    if (eachTime >= sixMinsAgo && eachTime <= day) {
                        currentSeaLevel = parsedLevels[index];
                    }

                });
                res.render('dashboard', {
                    seaLevel: currentSeaLevel,
                    buoy: buoys
                });
            });
        });
    });
});

/* GET LOGIN */
indexRoute.get('/login', (req, res, next) => {
    res.render('login.ejs', {
        errorMessage: req.flash('error') //req.flash returns array
    });
});

// POST LOGIN
indexRoute.post("/login",
    passport.authenticate("local", {
        successReturnToOrRedirect: "/", //Saves the previous location of the user
        failureRedirect: "/login", //IF they try to go to a non-authenticated page
        failureFlash: true, // Sends them there once they are authenticated
        successFlash: 'You successfully logged in',
        passReqToCallback: true
    }));

indexRoute.get('/logout', (req, res, next) => {
    req.logout();
    req.flash('success', 'You have been logged out');
    res.redirect('/');

});

/* GET REGISTER */
indexRoute.get('/register', (req, res, next) => {
    res.render('register');
});

/* POST REGISTER */
indexRoute.post('/register', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;



    if (username === "" || password === "") {
        res.render('register', {
            errorMessage: "Please make sure you fill both fields"
        });
        return;
    }

    User.findOne({
        username
    }, "username", (err, user) => {
        if (user !== null) {
            res.render('register', {
                errorMessage: "You're already part of the club!"
            });
            return;
        }

        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        const newUser = User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: username,
            encryptedPassword: hashPass
        });

        newUser.save((err) => {
            if (err) { // IF problem
                res.render("/register", {
                    message: message
                });
            } else { // If no problem ;)
                req.flash('success', 'You have been registered. Welcome to the wave.');
                res.redirect("index");
            }
        });
    });
});




module.exports = indexRoute;

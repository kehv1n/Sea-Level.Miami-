const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const layouts      = require('express-ejs-layouts');
const mongoose     = require('mongoose');
const session      = require ('express-session'); // Saves sessions to our DB
const passport     = require('passport'); // Require to make basic authentication & social authentication
const LocalStrategy= require('passport-local').Strategy;  //
const bcrypt       = require('bcrypt'); /// REQUIRE bcrypt to encrypt passwords
const flash        = require('connect-flash'); //// REQUIRE FLASH TO SEND USERS MESSAGES
const User         = require('./models/users.js');

require('dotenv').config();
const app = express();
mongoose.connect(process.env.MONGODB_URI);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// default value for title local
app.locals.title = 'seaLevel.Miami';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);


app.use(session({ //Use Sessions
  secret: 'Success is getting what you want. Happines is wanting what you get - DC',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize()); //Use Passport
app.use(passport.session()); //Use Passport Sessions
app.use(flash()); /// USES FLASH

passport.use(new LocalStrategy((username, password, next) => { //Use Local Strategy
  User.findOne({ userName: username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Incorrect username" });
    }
    if (!bcrypt.compareSync(password, user.encryptedPassword)) {
      return next(null, false, { message: "Incorrect password" });
    }

    return next(null, user);
  });
}));

passport.serializeUser((user, cb) => {
  if (user.provider) {
    cb(null, user);
  } else {
    cb(null, user._id);

  }
});

passport.deserializeUser((id, cb) => {
  if (id.provider) {
    cb(null, id);
    return;
  }
  User.findOne({ "_id": id }, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

/////////////////////// ROUTES ///////////////////////////////////////////////

const indexRoute = require('./routes/index');
app.use('/', indexRoute);

/////////////////////// ROUTES ///////////////////////////////////////////////

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

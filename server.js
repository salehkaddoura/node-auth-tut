// SERVER.JS

var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');

// CONFIGURATION =================================================
mongoose.connect(configDB.url); // connect to the database

require('./config/passport')(passport);  //pass passport for configuration 

// setup express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get info from html forms

app.set('view engine', 'ejs'); // setup ejs for templating

// required for passport
app.use(session({ secret: 'ilovesaleh '})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// ROUTES ========================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// LAUNCH ========================================================
app.listen(port);
console.log('The magic happens on port ' + port);


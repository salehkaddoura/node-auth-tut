// SERVER.JS
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var Parse = require('parse').Parse;

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');

Parse.initialize("eWovs6VR2B7vuyCR1SzxqJ3Jy5uIIVcgRD4RTme0", "BC2GmCRojnwpk1gSC5RWPiNR6F5oTGo5gL4XWEFV");

// CONFIGURATION =================================================
mongoose.connect(configDB.url); // connect to the database

require('./config/passport')(passport);  //pass passport for configuration
require('./config/parse')(Parse); 

// setup express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get info from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // setup ejs for templating
app.use(express.static(__dirname + '/public'));

// required for passport
app.use(session({ secret: 'ilovesaleh', resave: false, saveUninitialized: true })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// ROUTES ========================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport



// LAUNCH ========================================================
app.listen(port);
console.log('The magic happens on port ' + port);


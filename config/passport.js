// load all the things we need
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// load the user model
var User = require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // ================ PASSPORT SESSION SETUP ===============
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    //used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    // ================ LOCAL SIGNUP ===============
    // named strategies will be used since we have one for login and signup
    // by default, if there was no name, it would just be called local
    passport.use('local-signup', new LocalStrategy({
        //by default, local strategy uses username and password, you can override with email, birthdate etc
        // usernameField : 'email',
        // passwordField : 'password',
        passReqToCallback: true //allows us to pas back the entire request to the callback
    },
    function(req, username, password, done) {
        findOrCreateUser = function() {
            //find a user whos username is the same as the forms username
            //we are checking to see if the user trying to login already exists
            User.findOne({'username' : username}, function(err, user) {
                //if there are any errors, return the error
                if(err) {
                    console.log(err)
                    return done(err);
                }
                //check to see if theres already a user with that email
                if(user) {
                    console.log('User already exists');
                    return done(null, false, req.flash('signupMessage', 'User already exists!'));
                } else {
                    // if there is no user with that username create a newUser
                    var newUser = new User();
                    
                    //set the user's local credentials
                    newUser.local.username = username;
                    newUser.local.password = newUser.generateHash(password);

                    //save the user
                    newUser.save(function(err) {
                        if(err) {
                            console.log(err);
                            throw err;   
                        } else {
                            console.log('success');
                            return done(null, newUser);
                        }
                    });
                }
            });
        };
        // Delay the execution of findOrCreateUser and execute 
        // the method in the next tick of the event loop
        process.nextTick(findOrCreateUser);
    }));
};


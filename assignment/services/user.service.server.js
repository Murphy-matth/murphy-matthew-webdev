/**
 * Server side user service
 * Author: Matthew Murphy
 */

var app = require('../../express.js');
var userModel = require('../models/user/user.model.server');

var bcrypt = require("bcrypt-nodejs");

/**
 * Login and Authentication
 */
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use('local', new LocalStrategy(localStrategy));
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

app.post  ('/api/assignment/login', passport.authenticate('local'), login);
app.get   ('/api/assignment/checkLoggedIn', checkLoggedIn);
app.post  ('/api/assignment/logout', logout);
app.post  ('/api/assignment/register', register);

function login(req, res) {
    var user = req.user;
    res.json(user);
}

function logout(req, res) {
    req.logout();
    res.sendStatus(200);
}

function register(req, res) {
    var user = req.body;
    // Encrypt the password
    user.password = bcrypt.hashSync(user.password);
    userModel
        .createUser(user)
        .then(function (user) {
            req.login(user, function (status) {
                res.json(user);
            });
        });
}

function checkLoggedIn(req, res) {
    if(req.isAuthenticated()) {
        res.json(req.user);
    } else {
        res.send('0');
    }
}

function localStrategy(username, password, done) {
    userModel
        .findUserByUsername(username)
        .then(function (user) {
            if (!user) {
                return done(null, false);
            }
            if (user.username === username && bcrypt.compareSync(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        }, function (err) {
            if (err) {
                return done(err);
            } else {
                return done(null, false);
            }
        });
}

function serializeUser(user, done) {
    done(null, user);
}

function deserializeUser(user, done) {
    userModel
        .findUserById(user._id)
        .then(
            function(user){
                done(null, user);
            },
            function(err){
                done(err, null);
            }
        );
}

/**
 * End Login and Authentication
 */

/**
 * Facebook Authentication
 */
var FacebookStrategy = require('passport-facebook').Strategy;
var facebookConfig = {
    clientID     : process.env.FACEBOOK_CLIENT_ID,
    clientSecret : process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL  : process.env.FACEBOOK_CALLBACK_URL
};


app.get ('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/assignment/index2.html#!/user',
        failureRedirect: '/assignment/index2.html#!/login'
    }));

passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));

function facebookStrategy(token, refreshToken, profile, done) {
    userModel
        .findUserByFacebookId(profile.id)
        .then(function (user) {
            if (!user) {
                var newUser = {
                    username: profile.displayName,
                    facebook: {
                        id: profile.id,
                        token: token
                    }
                };

                return userModel
                    .createUser(newUser)
                    .then(function (response) {
                        return done(null, response);
                    })
            } else {
                return userModel
                    .updateFacebookToken(user._id, profile.id, token)
                    .then(function (response) {
                        return done(null, user);
                    })
            }
        })
}
/**
 * End Facebook Authentication
 */

app.get('/api/assignment/user/:uid', findUserById);
app.get('/api/assignment/user', findUserByCredentials);
app.get('/api/assignment/current', getCurrentUser);
app.post('/api/assignment/user', createUser);
app.put('/api/assignment/user/:uid', updateUser);
app.delete('/api/assignment/user:uid', deleteUser);

function getCurrentUser(req, res) {
    var user = req.user;
    res.json(user);
}

// Deletes the given user whose _id matches the uid
function deleteUser(req, res) {
    var userId = req.params.uid;

    userModel
        .deleteUser(userId)
        .then(function(status) {
            res.sendStatus(200);
        });
}

// Updates the given user whose _id matches the uid
function updateUser(req, res) {
    var user = req.body;
    var userId = req.params.uid;

    userModel
        .updateUser(userId, user)
        .then(function(status) {
            res.json(user);
        }, function(error) {
            res.sendStatus(404);
        });
}

// Creates the given user
function createUser(req, res) {
    var user = req.body;
    userModel
        .createUser(user)
        .then(function (user) {
            res.json(user);
        });
}

// Returns the user whose username and password match the username and password parameters.
function findUserByCredentials(req, res) {
    var username = req.query['username'];
    var password = req.query['password'];

    if (typeof password === 'undefined') {
        userModel
            .findUserByUsername(username)
            .then(function(user) {
                if(user !== null) {
                    res.json(user);
                } else {
                    res.sendStatus(404);
                }
            }, function (err) {
                res.sendStatus(404);
            })
    } else {
        userModel
            .findUserByCredentials(username, password)
            .then(function(user) {
                if(user !== null) {
                    res.json(user);
                } else {
                    res.sendStatus(404);
                }
            }, function (err) {
                res.sendStatus(404);
            })
    }
}

// Returns the user in local users array whose _id matches the userId parameter.
function findUserById(req, res) {
    var userId = req.params.uid;

    userModel
        .findUserById(userId)
        .then(function (user) {
            res.json(user);
        });
}

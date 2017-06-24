/**
 * Server side user service
 * Author: Matthew Murphy
 */

var app = require('../../express.js');
var userModel = require('../models/user/user.model.server');
var authenticator = require('../modules/authenticator.service.server.js');

var bcrypt = require("bcrypt-nodejs");

var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use('project', new LocalStrategy(localStrategy));
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

var multer = require('multer'); // npm install multer --save
var upload = multer({ dest: __dirname+'/../../public/project/uploads/profile/' });

/**
 * API Endpoints
 */

/**
 * Admin
 */

app.get('/api/project/checkAdmin', checkAdmin);

/**
 * Login and Authentication
 */
app.post  ('/api/project/login', passport.authenticate('project'), login);
app.post  ('/api/project/logout', logout);
app.post  ('/api/project/register', register);
app.get   ('/api/project/checkLoggedIn', checkLoggedIn);

/**
 * File Upload
 */
app.post ("/api/project/uploadProfile", upload.single('myFile'), uploadImage);

/**
 * Followers and Following
 */
app.get('/api/project/followers', getCurrentFollowers);
app.get('/api/project/following', getCurrentFollowing);
app.get('/api/project/follower/:fid', addFollower);
app.get('/api/project/user/:uid/followers', findFollowersByUser);
app.get('/api/project/user/:uid/following', findFollowingByUser);
app.delete('/api/project/following/:fid', removeFollowing);
app.delete('/api/project/follower/:fid', removeFollower);

/**
 * User Functions
 */
app.post('/api/project/password', updatePassword);
app.get('/api/project/user/:uid', findUserById);
app.get('/api/project/current', getCurrentUser);
app.get('/api/project/username', findUserByUsername);
app.put('/api/project/user', updateUser);
app.delete('/api/project/user/:uid', deleteUser);

/**
 * End API Endpoints
 */

/**
 * Admin
 */

/**
 * This function ensures that there is at least one admin user.
 */
function ensureAdmin() {
    var admin = {
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
        roles: ['ADMIN', 'USER']
    };

    userModel
        .findUserByUsername(process.env.ADMIN_USERNAME)
        .then(function (user) {
            if (!user) {
                userModel
                    .createUser(admin)
                    .then(function (success) {
                        // No op.
                        console.log(success);
                    }, function (err) {
                        console.log(err);
                        throw new Error("Problem with admin user: " + err);
                    });
            } else if (!user.roles.contains('ADMIN')) {
                throw new Error("Problem with admin user");
            }
        }, function (err) {
            userModel
                .createUser(admin)
                .then(function (success) {
                    // No op.
                }, function (err) {
                    throw new Error("Problem with admin user: " + err);
                });
        })
}
ensureAdmin(); // Always run this once.

function checkAdmin(req, res) {
    if (!authenticator.authenticate(req)) {
        res.sendStatus(401);
        return;
    }

    var user = req.user._id;
    userModel
        .findUserById(user)
        .then(function (user) {
            if (!user) {
                res.send('0');
                return;
            }
            var role = user.roles.find(function (r) {
                return r === 'ADMIN';
            });
            if (typeof role === 'undefined' || role.length < 1) {
                res.send('0');
            } else {
                res.send(sanitizeUser(user));
            }
        }, function (err) {
            res.send('0');
        })
}

/**
 * End Admin
 */

/**
 * Login and Authentication
 */

function login(req, res) {
    var user = req.user;
    res.json(sanitizeUser(user));
}

function logout(req, res) {
    req.logout();
    res.sendStatus(200);
}

function register(req, res) {
    var user = req.body;

    userModel
        .createUser(user)
        .then(function (user) {
            req.login(user, function (status) {
                res.json(sanitizeUser(user));
            });
        });
}

function checkLoggedIn(req, res) {
    if(req.isAuthenticated()) {
        res.json(sanitizeUser(req.user));
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
                return done(null, sanitizeUser(user));
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

/**
 * End Login and Authentication
 */

/**
 * Serialization and Deserialization
 */

function serializeUser(user, done) {
    done(null, sanitizeUser(user));
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
 * End Serialization and Deserialization
 */

/**
 * Facebook Authentication
 */
var FacebookStrategy = require('passport-facebook').Strategy;
var facebookConfig = {
    clientID     : process.env.FACEBOOK_CLIENT_ID,
    clientSecret : process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL  : process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'emails', 'displayName']
};


app.get ('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/project/index.html#!/user',
        failureRedirect: '/project/index.html#!/login'
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
                    },
                    roles: ['USER']
                };

                if (profile.emails.length > 0) {
                    newUser.email = profile.emails[0].value
                }

                return userModel
                    .createUser(newUser)
                    .then(function (response) {
                        return done(null, response);
                    }, function (err) {
                        return done(null, false);
                    })
            } else {
                return userModel
                    .updateFacebookToken(user._id, profile.id, token)
                    .then(function (response) {
                        return done(null, user);
                    })
            }
        }, function (err) {
            return done(null, false);
        })
}
/**
 * End Facebook Authentication
 */

/**
 * Google Authentication
 */

var GoogleStrategy = require('passport-google-oauth20').Strategy;
var googleConfig = {
    clientID     : process.env.GOOGLE_CLIENT_ID,
    clientSecret : process.env.GOOGLE_CLIENT_SECRET,
    callbackURL  : process.env.GOOGLE_CALLBACK_URL
};

app.get('/auth/google', passport.authenticate('google', { scope : 'profile' }));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/project/index.html#!/user',
        failureRedirect: '/project/index.html#!/login'
    }));

passport.use(new GoogleStrategy(googleConfig, googleStrategy));

function googleStrategy(token, refreshToken, profile, done) {
    userModel
        .findUserByGoogleId(profile.id)
        .then(function (user) {
            if (!user) {
                console.log(profile);
                var newUser = {
                    username: profile.displayName,
                    google: {
                        id: profile.id,
                        token: token
                    },
                    firstName: profile.givenName,
                    lastName: profile.familyName,
                    roles: ['USER']
                };

                return userModel
                    .createUser(newUser)
                    .then(function (response) {
                        return done(null, response);
                    }, function (err) {
                        return done(null, false);
                    })
            } else {
                return userModel
                    .updateGoogleToken(user._id, profile.id, token)
                    .then(function (response) {
                        return done(null, user);
                    })
            }
        }, function (err) {
            return done(null, false);
        })
}

/**
 * End Google Authentication
 */

/**
 * File Upload
 */

function uploadImage(req, res) {
    if (!authenticator.authenticate(req)) {
        res.sendStatus(401);
        return;
    }

    var userId      = req.user._id;
    var myFile        = req.file;

    var originalname  = myFile.originalname; // file name on user's computer
    var filename      = myFile.filename;     // new file name in upload folder
    var path          = myFile.path;         // full path of uploaded file
    var destination   = myFile.destination;  // folder where file is saved to
    var size          = myFile.size;
    var mimetype      = myFile.mimetype;

    var url = '/project/uploads/profile/'+ filename;

    userModel
        .updateUrl(userId, url)
        .then(function (status) {
            var callbackUrl   = '/project/index.html#!/user/';
            res.redirect(callbackUrl);
        });
}

/**
 * End File Upload
 */

/**
 * Followers and Following
 */
function getCurrentFollowers(req, res) {
    if (!authenticator.authenticate(req)) {
        res.sendStatus(401);
        return;
    }

    var user = req.user;
    if (!user.followers) {
        res.send([]);
    }

    userModel
        .findUsersByIds(user.followers)
        .then(function (followers) {
            res.json(followers);
        })

}

function getCurrentFollowing(req, res) {
    if (!authenticator.authenticate(req)) {
        res.sendStatus(401);
        return;
    }

    var user = req.user;
    if (!user.following) {
        res.send([]);
    }

    userModel
        .findUsersByIds(user.following)
        .then(function (following) {
            res.json(following);
        })
}

function findFollowingByUser(req, res) {
    if (!authenticator.authenticate(req)) {
        res.sendStatus(401);
        return;
    }

    var userId = req.params.uid;

    userModel
        .findUserById(userId)
        .then(function (user) {
            if (user.following.length > 0) {
                userModel
                    .findUsersByIds(user.following)
                    .then(function (following) {
                        res.json(following);
                    })
            } else {
                res.send([]);
            }
        }, function (err) {
            res.send([]);
        })
}

function findFollowersByUser(req, res) {
    if (!authenticator.authenticate(req)) {
        res.sendStatus(401);
        return;
    }

    var userId = req.params.uid;

    userModel
        .findUserById(userId)
        .then(function (user) {
            if (user.followers.length > 0) {
                userModel
                    .findUsersByIds(user.followers)
                    .then(function (followers) {
                        res.json(followers);
                    })
            } else {
                res.send([]);
            }
        }, function (err) {
            res.send([]);
        })
}

function addFollower(req, res) {
    if (!authenticator.authenticate(req)) {
        res.sendStatus(401);
        return;
    }

    var user = req.user;
    var userId = user._id;
    var followerId = req.params.fid;

    userModel
        .addFollowing(userId, followerId)
        .then(function (response) {
            userModel
                .addFollower(followerId, userId)
                .then(function (response) {
                    res.sendStatus(200);
                })
        })
}

function removeFollower(req, res) {
    if (!authenticator.authenticate(req)) {
        res.sendStatus(401);
        return;
    }

    var userId = req.user._id;
    var followerId = req.params.fid;

    userModel
        .removeFollower(userId, followerId)
        .then(function (response) {
            userModel
                .removeFollowing(followerId, userId)
                .then(function (response) {
                    getCurrentFollowers(req, res);
                })
        })
}

function removeFollowing(req, res) {
    if (!authenticator.authenticate(req)) {
        res.sendStatus(401);
        return;
    }

    var userId = req.user._id;
    var followerId = req.params.fid;

    userModel
        .removeFollowing(userId, followerId)
        .then(function (response) {
            userModel
                .removeFollower(followerId, userId)
                .then(function (response) {
                    getCurrentFollowing(req, res);
                })
        })
}

/**
 * End Followers and Following
 */

/**
 * User Functions
 */

function findUserByUsername(req, res) {
    if (!authenticator.authenticate(req)) {
        res.sendStatus(401);
        return;
    }

    var username = req.query['username'];
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
}

function getCurrentUser(req, res) {
    if (!authenticator.authenticate(req)) {
        res.sendStatus(401);
        return;
    }

    var user = req.user;
    delete user._id;
    res.json(user);
}

function updatePassword(req, res) {
    if (!authenticator.authenticate(req)) {
        res.sendStatus(401);
        return;
    }

    var user = req.user;
    var userId = user._id;
    var password = req.body;

    if (!bcrypt.compareSync(password.old, user.password)) {
        res.sendStatus(401);
        return;
    }

    userModel
        .updatePassword(userId, password.new)
        .then(function (response) {
            res.sendStatus(200);
        })
}

// Updates the given user. Will not update username or password.
function updateUser(req, res) {
    if (!authenticator.authenticate(req)) {
        res.sendStatus(401);
        return;
    }

    var user = req.body;
    var userId = req.user._id;

    userModel
        .updateUser(userId, user)
        .then(function(newUser) {
            res.json(newUser);
        }, function(error) {
            res.sendStatus(404);
        });
}

// Currently no one can delete a user.
function deleteUser(req, res) {
    if (!authenticator.authenticate(req)) {
        res.sendStatus(401);
        return;
    }

    var userId = req.params.uid;

    userModel
        .deleteUser(userId)
        .then(function(status) {
            res.sendStatus(200);
        });
}

// Returns the user whose _id matches the userId parameter.
function findUserById(req, res) {
    if (!authenticator.authenticate(req)) {
        res.sendStatus(401);
        return;
    }

    var userId = req.params.uid;

    userModel
        .findUserById(userId)
        .then(function (user) {
            res.json(user);
        });
}

function sanitizeUser(user) {
    delete user._id;
    delete user.password;
    return user;
}

/**
 * End User Functions
 */

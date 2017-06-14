/**
 * Server side user service
 * Author: Matthew Murphy
 */

var app = require('../../express.js');
var userModel = require('../models/user/user.model.server');

var multer = require('multer'); // npm install multer --save
var upload = multer({ dest: __dirname+'/../../public/project/uploads/profile/' });

app.post('/api/project/user', createUser);
app.get('/api/project/user/:uid/password/:pass', updatePassword);
app.post ("/api/project/uploadProfile", upload.single('myFile'), uploadImage);
app.get('/api/project/user/:uid', findUserById);
app.get('/api/project/user', findUserByCredentials);
app.get('/api/project/user/:uid/follower/:fid', addFollower);
app.get('/api/project/user/:uid/followers', findFollowersByIds);
app.get('/api/project/user/:uid/following', findFollowingByIds);
app.delete('/api/project/user/:uid/following/:fid', removeFollowing);
app.delete('/api/project/user/:uid/follower/:fid', removeFollower);
app.put('/api/project/user/:uid', updateUser);
app.delete('/api/project/user/:uid', deleteUser);

function updatePassword(req, res) {
    var userId = req.params.uid;
    var passwprd = req.params.pass;

    userModel
        .updatePassword(userId, passwprd)
        .then(function (response) {
            res.sendStatus(200);
        })
}

function findFollowingByIds(req, res) {
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
        })
}

function findFollowersByIds(req, res) {
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
        })
}

function addFollower(req, res) {
    var userId = req.params.uid;
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
    var userId = req.params.uid;
    var followerId = req.params.fid;

    userModel
        .removeFollower(userId, followerId)
        .then(function (response) {
            userModel
                .removeFollowing(followerId, userId)
                .then(function (response) {
                    findFollowersByIds(req, res);
                })
        })
}

function removeFollowing(req, res) {
    var userId = req.params.uid;
    var followerId = req.params.fid;

    userModel
        .removeFollowing(userId, followerId)
        .then(function (response) {
            userModel
                .removeFollower(followerId, userId)
                .then(function (response) {
                    findFollowingByIds(req, res);
                })
        })
}

function uploadImage(req, res) {

    var userId      = req.body.userId;
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
            var callbackUrl   = "/project/index.html#!/user/"+userId;
            res.redirect(callbackUrl);
        });
}

// Updates the given user. Will not update username or password.
function updateUser(req, res) {
    var user = req.body;
    var userId = req.params.uid;

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
    var userId = req.params.uid;

    userModel
        .deleteUser(userId)
        .then(function(status) {
            res.sendStatus(200);
        });
}

// Creates the given user
function createUser(req, res) {
    var user = req.body;

    userModel
        .createUser(user)
        .then(function (user) {
            res.json(user);
        }, function (err) {
            res.sendStatus(404).send("Unable to create user.")
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

// Returns the user whose _id matches the userId parameter.
function findUserById(req, res) {
    var userId = req.params.uid;

    userModel
        .findUserById(userId)
        .then(function (user) {
            console.log(user);
            res.json(user);
        });
}

/**
 * Server side user service
 * Author: Matthew Murphy
 */

var app = require('../../express.js');
var userModel = require('../models/user/user.model.server');

app.get('/api/assignment/user/:uid', findUserById);
app.get('/api/assignment/user', findUserByCredentials);
app.post('/api/assignment/user', createUser);
app.put('/api/assignment/user/:uid', updateUser);
app.delete('/api/assignment/user:uid', deleteUser);

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

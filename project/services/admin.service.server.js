/**
 * Server side admin service
 * Author: Matthew Murphy
 */

var app = require('../../express.js');
var repModel = require('../models/representatives/rep.model.server');
var userModel = require('../models/user/user.model.server');
var authenticator = require('../modules/authenticator.service.server.js');

app.get('/api/project/admin/users', findAllUsers);
app.post('/api/project/admin/user', updateUser);
app.post('/api/project/admin/user/create', createUser);
app.delete('/api/project/admin/user/:uid', deleteUser);

function createUser(req, res) {
    if (!authenticator.authenticate(req)){
        res.sendStatus(401);
        return;
    }

    var admin = req.user;
    var user = req.body;
    checkAdmin(admin)
        .then(function (admin) {
            if (admin) {
                userModel
                    .createUser(user)
                    .then(function (success) {
                        res.sendStatus(200);
                    }, function (err) {
                        res.sendStatus(500);
                    })
            } else {
                res.sendStatus(401);
            }
        }, function (err) {
            res.sendStatus(500);
        })
}

function updateUser(req, res) {
    if (!authenticator.authenticate(req)){
        res.sendStatus(401);
        return;
    }

    var admin = req.user;
    var user = req.body;
    checkAdmin(admin)
        .then(function (admin) {
            if (admin) {
                userModel
                    .updateUser(user._id, user)
                    .then(function (success) {
                        res.sendStatus(200);
                    }, function (err) {
                        res.sendStatus(500);
                    })
            } else {
                res.sendStatus(401);
            }
        }, function (err) {
            res.sendStatus(500);
        })
}

function deleteUser(req, res) {
    if (!authenticator.authenticate(req)){
        res.sendStatus(401);
        return;
    }

    var user = req.user;
    var userId = req.params.uid;

    checkAdmin(user)
        .then(function (admin) {
            if (admin) {
                userModel
                    .deleteUser(userId)
                    .then(function (success) {
                        res.sendStatus(200);
                    }, function (err) {
                        res.sendStatus(500);
                    })
            } else {
                res.sendStatus(401);
            }
        }, function (err) {
            res.sendStatus(500);
        })
}

function findAllUsers(req, res) {
    if (!authenticator.authenticate(req)) {
        res.sendStatus(401);
        return;
    }

    var user = req.user;
    checkAdmin(user)
        .then(function (admin) {
            if (admin) {
                userModel
                    .find()
                    .then(function (allUsers) {
                        var users = allUsers.filter(function (user) {
                            for (var ii = 0; ii < user.roles.length; ii++) {
                                if (user.roles[ii] === 'ADMIN') {
                                    return false;
                                }
                            }
                            return true;
                        });
                        res.send(users);
                    }, function (err) {

                    })
            } else {
                res.sendStatus(401);
            }
        })
}


function checkAdmin(user) {
    return userModel
            .findUserById(user._id)
            .then(function (user) {
                if (!user) {
                    return false;
                }
                var role = user.roles.find(function (r) {
                    return r === 'ADMIN';
                });
                return role.length > 0;
            }, function (err) {
                return false;
            })
}
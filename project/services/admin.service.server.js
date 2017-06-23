/**
 * Server side admin service
 * Author: Matthew Murphy
 */

var app = require('../../express.js');
var repModel = require('../models/representatives/rep.model.server');
var userModel = require('../models/user/user.model.server');
var authenticator = require('../modules/authenticator.service.server.js');

app.get('/api/project/admin/users', findAllUsers);
app.get('/api/project/admin/reps', findAllReps);
app.post('/api/project/admin/user', updateUser);
app.post('/api/project/admin/rep', updateRep);
app.post('/api/project/admin/user/create', createUser);
app.delete('/api/project/admin/user/:uid', deleteUser);
app.delete('/api/project/admin/rep/:repId', deleteRep);

function updateRep(req, res) {
    if (!authenticator.authenticate(req)){
        res.sendStatus(401);
        return;
    }

    var admin = req.user;
    var rep = req.body;
    checkAdmin(admin)
        .then(function (admin) {
            if (admin) {
                repModel
                    .updateRep(rep)
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

function deleteRep(req, res) {
    if (!authenticator.authenticate(req)){
        res.sendStatus(401);
        return;
    }

    var user = req.user;
    var repId = req.params.repId;

    checkAdmin(user)
        .then(function (admin) {
            if (admin) {
                repModel
                    .deleteRep(repId)
                    .then(function (success) {
                        var users = userModel.find();
                        for (var ii = 0; ii < users.length; ii++) {
                            ( function() {
                              var reps = users[ii].reps.filter(function (rep) {
                                  return rep !== repId;
                              });
                              users[ii].reps = reps;
                            })();
                        }
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

function findAllReps(req, res) {
    if (!authenticator.authenticate(req)){
        res.sendStatus(401);
        return;
    }

    var admin = req.user;

    checkAdmin(admin)
        .then(function (admin) {
            if (admin) {
                repModel
                    .find()
                    .then(function (reps) {
                        res.json(reps);
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
                if (user.admin) {
                    user.roles = ['ADMIN', 'USER'];
                    delete user.admin;
                }
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
                        var followers = user.followers;
                        var following = user.following;
                        for (var ii = 0; ii < followers.length; ii++) {
                            (function () {
                                userModel.removeFollower(followers[ii], userId);
                            })()
                        }
                        for (var jj = 0; jj < following.length; jj++) {
                            (function () {
                                userModel.removeFollowing(following[ii], userId);
                            })()
                        }
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
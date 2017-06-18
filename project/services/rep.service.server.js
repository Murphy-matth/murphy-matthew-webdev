/**
 * Server side rep service
 * Author: Matthew Murphy
 */

var app = require('../../express.js');
var repModel = require('../models/representatives/rep.model.server');
var userModel = require('../models/user/user.model.server');
var authenticator = require('../modules/authenticator.service.server.js');

app.post('/api/project/rep', createRep);
app.get('/api/project/rep/:uid/reps', findRepsByUser);
app.get('/api/project/reps', findReps);
app.delete('/api/project/rep/:rid', deleteRep);
app.delete('/api/project/rep/', deleteRep);

function findReps(req, res) {
    if (!authenticator.authenticate(req)) {
        res.sendStatus(401);
        return;
    }

    var user = req.user;
    if (user.reps) {
        repModel
            .findResByIds(user.reps)
            .then(function (reps) {
                res.send(reps);
            }, function (err) {
                res.send([]);
            });
    } else {
        res.send([]);
    }
}

function deleteRep(req, res) {
    if (!authenticator.authenticate(req)) {
        res.sendStatus(401);
        return;
    }

    var userId = req.user._id;
    var repId = req.params.rid;

    userModel
        .removeRep(userId, repId)
        .then(function (response) {
            findRepsByUser(req, res);
        })
}

function findRepsByUser(req, res) {
    if (!authenticator.authenticate(req)) {
        res.sendStatus(401);
        return;
    }

    var userId = req.params.uid;

    if (!userId) {
        userId = req.user._id;
    }

    userModel
        .findUserById(userId)
        .then(function (user) {
            if (!user) {
                res.sendStatus(404);
            }
            repModel
                .findResByIds(user.reps)
                .then(function (reps) {
                    res.send(reps);
                })
        })
}

// Creates the given rep
function createRep(req, res) {
    if (!authenticator.authenticate(req)) {
        res.sendStatus(401);
        return;
    }

    var userId = req.user._id;
    var rep = req.body;

    if (rep.id) {
        rep.photo = 'https://theunitedstates.io/images/congress/225x275/' + rep.id + '.jpg'
    }

    var newRep = {
        name: rep.name || rep.first_name + " " + rep.last_name,
        govId: rep.id || rep.member_id,
        photo: rep.photo,
        chamber: rep.chamber
    };

    repModel
        .findRepByGovIdOrCreate(newRep)
        .then(function (rep) {
            userModel
                .addRep(userId, rep._id)
                .then(function (response) {
                    res.sendStatus(200);
                })
        });
}

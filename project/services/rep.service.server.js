/**
 * Server side rep service
 * Author: Matthew Murphy
 */

var app = require('../../express.js');
var repModel = require('../models/representatives/rep.model.server');
var userModel = require('../models/user/user.model.server');


app.post('/api/project/rep/:uid', createRep);
app.get('/api/project/rep/:uid/reps', findRepsByUser);
app.delete('/api/project/user/:uid/rep/:rid', deleteRep);

function deleteRep(req, res) {
    var userId = req.params.uid;
    var repId = req.params.rid;

    userModel
        .removeRep(userId, repId)
        .then(function (response) {
            findRepsByUser(req, res);
        })

}

function findRepsByUser(req, res) {
    var userId = req.params.uid;

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
    var userId = req.params.uid;
    var rep = req.body;

    var newRep = {
        name: rep.name || rep.first_name + " " + rep.last_name,
        govId: rep.id || rep.member_id,
        photo: rep.photo || 'http://lorempixel.com/200/200',
        chamber: rep.chamber
    };

    console.log(rep);
    console.log(newRep);

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

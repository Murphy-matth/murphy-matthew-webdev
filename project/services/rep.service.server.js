/**
 * Server side rep service
 * Author: Matthew Murphy
 */

var app = require('../../express.js');

var reps = [];

app.post('/api/project/rep', createRep);
app.get('/api/project/rep/:rid', findRepById);
app.put('/api/project/user/:rid', updateRep);
app.delete('/api/project/user/:rid', deleteRep);

// Creates the given rep
function createRep(req, res) {
    var rep = req.body;

    rep._id = (new Date()).getTime() + ""; // This seems really bad.
    reps.push(user);

    res.send(rep);
}

// Returns the rep in local reps array whose id matches the repId parameter.
function findRepById(req, res) {
    var id = req.params.rid;

    var result = reps.find(function(rep) {
        return rep.id === id;
    });
    if (result === 'undefined') {
        return res.send(404);
    } else {
        res.send(result);
    }
}

function updateRep(req, res) {
    var repId = req.params.rid;
    var rep = req.body;

    for (var ii = 0; ii < reps.length; ii++) {
        var tempRep = reps[ii];
        if (tempRep.id === repId) {
            reps[ii] = rep;
            res.send(rep);
            return;
        }
    }
    res.sendStatus(404);
}

function deleteRep(req, res) {
    res.sendStatus(200);
}

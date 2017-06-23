/**
 * MongoDB User Model
 * Author: Matthew Murphy
 */

var mongoose = require('mongoose');
var representativeSchema = require('./rep.schema.server');
var q = require('q');
var repModel = mongoose.model('ProjectRepresentativeModel', representativeSchema);

// API Functions
repModel.createRep = createRep;
repModel.findRepByGovId = findRepByGovId;
repModel.findRepByGovIdOrCreate = findRepByGovIdOrCreate;
repModel.findResByIds = findResByIds;
repModel.updateRep = updateRep;
repModel.deleteRep = deleteRep;

module.exports = repModel;

function deleteRep(repId) {
    return repModel.remove({_id: repId});
}

function updateRep(rep) {
    return repModel
        .update({_id: rep._id}, {
            $set: {
                photo: rep.photo,
                name: rep.name,
                govId: rep.govId,
                chamber: rep.chamber
            }
        });
}

function findResByIds(reps) {
    return repModel.find({_id: {$in : reps}});
}

function createRep(rep) {
    return repModel.create(rep);
}

function findRepByGovId(repId) {
    return repModel.findOne({govId: repId});
}

function findRepByGovIdOrCreate(newRep) {
    return repModel
        .findOne({govId: newRep.govId})
        .then(function (rep) {
            if (!rep) {
                return repModel
                    .createRep(newRep)
                    .then(function (result) {
                        return result;
                    });
            } else {
                return repModel
                    .updateRep(rep)
                    .then(function (success) {
                        return rep;
                    }, function (err) {
                        console.log(err);
                        return rep;
                    });
            }
        })
}

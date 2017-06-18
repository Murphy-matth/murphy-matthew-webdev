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
repModel.update = update;

module.exports = repModel;

function update(rep) {
    return repModel
        .update({govId: rep.govId}, {
            $set : {
                govId: rep.govId,
                chamber: rep.chamber,
                name: rep.name,
                dateCreated: Date.now
            }
        })
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
                    .update(rep)
                    .then(function (success) {
                        return rep;
                    }, function (err) {
                        console.log(err);
                        return rep;
                    });
            }
        })
}

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

module.exports = repModel;

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
                        console.log("Create");
                        console.log(result);
                        return result;
                    });
            } else {
                console.log("Do not create");
                console.log(rep);
                return rep;
            }
        })
}

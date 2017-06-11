/**
 * MongoDB Website Model
 * Author: Matthew Murphy
 */

var mongoose = require('mongoose');
var websiteSchema = require('./website.schema.server');
var q = require('q');
var websiteModel = mongoose.model('AssignmentWebsiteModel', websiteSchema);
var userModel = mongoose.model('AssignmentUserModel');


// API Functions
websiteModel.createWebsite = createWebsite;
websiteModel.findWebsitesByUser = findWebsitesByUser;
websiteModel.findWebsiteById = findWebsiteById;
websiteModel.deleteWebsite = deleteWebsite;
websiteModel.updateWebsite = updateWebsite;
websiteModel.addPage = addPage;
websiteModel.removePage = removePage;

module.exports = websiteModel;

function removePage(websiteId, pageId) {
    return websiteModel
        .update({_id: websiteId}, {
            $pull : {
                pages: pageId
            }
        });
}

function addPage(websiteId, pageId) {
    return websiteModel
        .update({_id: websiteId}, {
            $push : {
                pages: pageId
            }
        });
}

function updateWebsite(websiteId, website) {
    return websiteModel.update({_id: websiteId}, {
        $set : {
            name: website.name,
            description: website.description
        }
    });
}

function deleteWebsite(websiteId) {
    return websiteModel
        .findByIdAndRemove({_id: websiteId}, function (err, website) {
            if (err) {
                return;
            }
            if (website) {
                userModel
                    .removeWebsite(website._developerId, websiteId)
                    .then(function (result) {
                        return result;
                    });
            } else {
                console.log("Error removing website");
                return "Error";
            }
        });
}

function findWebsiteById(websiteId) {
    return websiteModel.findById(websiteId);
}

function findWebsitesByUser(developerId) {
    return websiteModel
        .find({_developerId: developerId})
        .populate('_developerId', 'username')
        .exec();
}

function createWebsite(website, userId) {
    return websiteModel
        .create(website)
        .then(function (status) {
            userModel
                .addWebsite(userId, status._id)
                .then(function (result) {
                    return result;
                });
        });
}
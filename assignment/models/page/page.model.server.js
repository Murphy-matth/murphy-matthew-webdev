/**
 * MongoDB Page Model
 * Author: Matthew Murphy
 */

var mongoose = require('mongoose');
var pageSchema = require('./page.schema.server');
var q = require('q');
var pageModel = mongoose.model('AssignmentPageModel', pageSchema);
var websiteModel = mongoose.model('AssignmentWebsiteModel');

// API Functions
pageModel.createPage = createPage;
pageModel.findPagesByWebsite = findPagesByWebsite;
pageModel.findPageById = findPageById;
pageModel.deletePage = deletePage;
pageModel.updatePage = updatePage;
pageModel.addWidget = addWidget;
pageModel.removeWidget = removeWidget;

module.exports = pageModel;

function removeWidget(pageId, widgetId) {
    return pageModel
        .update({_id: pageId}, {
            $pull : {
                widgets: widgetId
            }
        });
}

function addWidget(pageId, widgetId) {
    return pageModel
        .update({_id: pageId}, {
            $push : {
                widgets: widgetId
            }
        });
}

function updatePage(pageId, page) {
    return pageModel.update({_id: pageId}, {
        $set : {
            name: page.name,
            description: page.description
        }
    });
}

function deletePage(pageId) {
    return pageModel
        .findByIdAndRemove(pageId, function (err, page) {
            if (err) {
                return;
            }
            if (page) {
                var websiteId = page._websiteId;
                return websiteModel
                        .removePage(websiteId, pageId)
                        .then(function (result) {
                            return page;
                        });
            } else {
                console.log("Error removing page");
                return "Error";
            }
    });
}

function findPageById(pageId) {
    return pageModel.findById(pageId);
}

function findPagesByWebsite(websiteId) {
    return pageModel
        .find({_websiteId: websiteId})
        .populate('_websiteId', 'name')
        .exec();
}

function createPage(page) {
    return pageModel
        .create(page)
        .then(function (status) {
            var pageId = status._id;
            var websiteId = status._websiteId;
            console.log([pageId, websiteId]);
            websiteModel
                .addPage(websiteId, pageId)
                .then(function (result) {
                    return status;
                });
        });
}
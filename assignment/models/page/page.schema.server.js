/**
 * MongoDB Page Schema
 * Author: Matthew Murphy
 */

var mongoose = require('mongoose');

var pageSchema = mongoose.Schema({
    _websiteId: {type: mongoose.Schema.ObjectId, ref: "AssignmentWebsiteModel"},
    description: {type: String, require: true},
    widgets: [{type: mongoose.Schema.ObjectId, ref: "AssignmentWidgetModel"}],
    name: {type: String, require: true}
}, {collection: "udergraduate_assignment_page"});

module.exports = pageSchema;

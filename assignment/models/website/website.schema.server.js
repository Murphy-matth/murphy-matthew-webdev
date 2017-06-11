/**
 * MongoDB Website Schema
 * Author: Matthew Murphy
 */

var mongoose = require('mongoose');

var websiteSchema = mongoose.Schema({
    _developerId: {type: mongoose.Schema.ObjectId, ref: "AssignmentUserModel"},
    pages: [{type: mongoose.Schema.ObjectId, ref: "AssignmentPageModel"}],
    description: {type: String, require: true},
    name: {type: String, require: true},
}, {collection: "udergraduate_assignment_website"});

module.exports = websiteSchema;

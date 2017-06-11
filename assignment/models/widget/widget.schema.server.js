/**
 * MongoDB Widget Schema
 * Author: Matthew Murphy
 */

var mongoose = require('mongoose');

var widgetSchema = mongoose.Schema({
    _pageId: {type: mongoose.Schema.ObjectId, ref: "AssignmentPageModel"},
    name: {type: String, require: true},
    widgetType: {type: String, require: true},
    url: String,
    width: String,
    size: Number,
    text: String,
    placeholder: String,
    description: String,
    height: String,
    rows: Number,
    class: String,
    icon: String,
    deletable: Boolean,
    formatted: Boolean,
    dateCreated: {type: Date, default: Date.now}
}, {collection: "udergraduate_assignment_widget"});

module.exports = widgetSchema;

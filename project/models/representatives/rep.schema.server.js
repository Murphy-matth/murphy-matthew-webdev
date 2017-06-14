/**
 * MongoDB Representative Schema.
 * Author: Matthew Murphy
 */

var mongoose = require('mongoose');

var representativeSchema = mongoose.Schema({
    name: String,
    photo: {type: String, default: 'http://lorempixel.com/200/200'},
    chamber: String,
    govId: {type: String, required: true},
    dateCreated: {type: Date, default: Date.now}
}, {collection: "udergraduate_project_representative"});

module.exports = representativeSchema;

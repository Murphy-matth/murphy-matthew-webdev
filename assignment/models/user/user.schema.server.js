/**
 * MongoDB User Schema
 * Author: Matthew Murphy
 */

var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: {type: String, require: true},
    password: {type: String, require: true},
    websites: [{type: mongoose.Schema.ObjectId, ref: "AssignmentWebsiteModel"}],
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    dateCreated: {type: Date, default: Date.now},
    rating: {type: Number, default: 0}
}, {collection: "udergraduate_assignment_user"});

module.exports = userSchema;

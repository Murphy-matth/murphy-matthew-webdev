/**
 * MongoDB User Schema.
 * Author: Matthew Murphy
 */

var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: {type: String, require: true},
    password: {type: String, require: true},
    firstName: String,
    lastName: String,
    photo: {type: String, default: "http://lorempixel.com/200/200"},
    email: String,
    phone: String,
    reps: [{type: mongoose.Schema.ObjectId, ref: "ProjectRepresentativeModel"}],
    following: [{type: mongoose.Schema.ObjectId, ref: "ProjectUserModel", unique: true}],
    followers: [{type: mongoose.Schema.ObjectId, ref: "ProjectUserModel", unique: true}],
    dateCreated: {type: Date, default: Date.now}
}, {collection: "udergraduate_project_user"});

module.exports = userSchema;

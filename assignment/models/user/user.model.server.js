/**
 * MongoDB User Model
 * Author: Matthew Murphy
 */

var mongoose = require('mongoose');
var userSchema = require('./user.schema.server');
var q = require('q');
var userModel = mongoose.model('AssignmentUserModel', userSchema);

// API Functions
userModel.createUser = createUser;
userModel.findUserById = findUserById;
userModel.findUserByCredentials = findUserByCredentials;
userModel.findUserByUsername = findUserByUsername;
userModel.deleteUser = deleteUser;
userModel.updateUser = updateUser;
userModel.addWebsite = addWebsite;
userModel.removeWebsite = removeWebsite;
userModel.findUserByFacebookId = findUserByFacebookId;
userModel.updateFacebookToken = updateFacebookToken;

module.exports = userModel;

function updateFacebookToken(userId, facebookId, token) {
    var facebook = {
        id: facebookId,
        token: token
    };

    return userModel
        .update({_id: userId}, {
            $set : {
                facebook: facebook
            }
        });
}

function findUserByFacebookId(facebookId) {
    return userModel.findOne({'facebook.id': facebookId});
}


function removeWebsite(userId, websiteId) {
    return userModel
        .update({_id: userId}, {
            $pull : {
                websites: websiteId
            }
        });
}

function addWebsite(userId, websiteId) {
    return userModel
        .update({_id: userId}, {
            $push : {
                websites: websiteId
            }
        });
}

function findUserByUsername(username) {
    return userModel.findOne({username: username});
}

function updateUser(userId, newUser) {
    delete newUser.username;

    return userModel.update({_id: userId}, {
        $set : {
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email
        }
    });
}

function deleteUser(userId) {
    return userModel.remove({_id: userId});
}

function findUserByCredentials(username, password) {
    return userModel.findOne({username: username, password: password});
}

function findUserById(userId) {
    return userModel.findById(userId);
}

function createUser(user) {
    return userModel.create(user);
}
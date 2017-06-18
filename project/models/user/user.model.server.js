/**
 * MongoDB User Model
 * Author: Matthew Murphy
 */

var mongoose = require('mongoose');
var userSchema = require('./user.schema.server');
var q = require('q');
var bcrypt = require("bcrypt-nodejs");
var userModel = mongoose.model('ProjectUserModel', userSchema);

// API Functions
userModel.createUser = createUser;
userModel.findUserById = findUserById;
userModel.findUserByCredentials = findUserByCredentials;
userModel.findUserByUsername = findUserByUsername;
userModel.deleteUser = deleteUser;
userModel.updateUser = updateUser;
userModel.addWebsite = addWebsite;
userModel.removeWebsite = removeWebsite;
userModel.updateUrl = updateUrl;
userModel.addFollower = addFollower;
userModel.removeFollower = removeFollower;
userModel.addFollowing = addFollowing;
userModel.removeFollowing = removeFollowing;
userModel.findUsersByIds = findUsersByIds;
userModel.updatePassword = updatePassword;
userModel.addRep = addRep;
userModel.removeRep = removeRep;
userModel.findUserByFacebookId = findUserByFacebookId;
userModel.updateFacebookToken = updateFacebookToken;
userModel.findUserByGoogleId = findUserByGoogleId;
userModel.updateGoogleToken = updateGoogleToken;

module.exports = userModel;

function findUserByGoogleId(googleId) {
    return userModel.findOne({'google.id': googleId});
}

function updateGoogleToken(userId, googleId, token) {
    var google = {
        id: googleId,
        token: token
    };

    return userModel
        .update({_id: userId}, {
            $set : {
                google: google
            }
        });
}

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

function addRep(userId, repId) {
    return userModel.update({_id: userId}, {
        $addToSet: {
            reps: repId
        }
    })
}

function removeRep(userId, repId) {
    return userModel.update({_id: userId}, {
        $pull: {
            reps: repId
        }
    })
}

function updatePassword(userId, password) {
    var hashed = bcrypt.hashSync(password);
    return userModel.update({_id: userId}, {
        $set : {
            password: hashed
        }
    })
}

function findUsersByIds(ids) {
    return userModel.find({_id: {$in: ids}});
}

function addFollowing(userId, followerId) {
    return userModel.update({_id: userId}, {
        $addToSet: {
            following: followerId
        }
    })
}

function removeFollowing(userId, followerId) {
    return userModel.update({_id: userId}, {
        $pull: {
            following: followerId
        }
    })
}

function addFollower(userId, followerId) {
    return userModel.update({_id: userId}, {
        $addToSet: {
            followers: followerId
        }
    })
}

function removeFollower(userId, followerId) {
    return userModel.update({_id: userId}, {
        $pull: {
            followers: followerId
        }
    })
}

function updateUrl(userId, url) {
    return userModel.update({_id: userId}, {
        $set : {
            photo: url
        }
    });
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
    delete newUser.password;
    delete newUser.username;

    return userModel.update({_id: userId}, {
        $set : {
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            phone: newUser.phone
        }
    });
}

function deleteUser(userId) {
    return userModel.remove({_id: userId});
}

function findUserByCredentials(username, password) {
    return userModel
        .find({username: username})
        .then(function (user) {
            if (!user) {
                return user;
            }
            if (user.username === username && bcrypt.compareSync(password, user.password)) {
                return user;
            }
            return null;
        });
}

function findUserById(userId) {
    return userModel.findById(userId);
}

function createUser(user) {
    if (user.password) {
        user.password = bcrypt.hashSync(user.password);
    }
    console.log(user);
    return userModel.create(user);
}

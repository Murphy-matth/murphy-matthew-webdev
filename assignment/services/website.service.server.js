/**
 * Server side website service
 * Author: Matthew Murphy
 */

var app = require('../../express.js');
var websiteModel = require('../models/website/website.model.server');

app.post('/api/assignment/user/:userId/website', createWebsite);
app.get('/api/assignment/user/:userId/website', findWebsitesByUser);
app.get('/api/assignment/website/:websiteId', findWebsiteById);
app.put('/api/assignment/website/:websiteId', updateWebsite);
app.delete('/api/assignment/website/:websiteId', deleteWebsite);

// adds the website parameter instance to the local websites array.
// The new website's developerId is set to the userId parameter.
function createWebsite(req, res) {
    var website = req.body;
    var userId = req.params.userId;

    website._developerId = userId;

    websiteModel
        .createWebsite(website, userId)
        .then(function (status) {
            res.json(website);
        });
}

// Retrieves the websites in local websites array whose developerId matches the parameter userId.
function findWebsitesByUser(req, res) {
    websiteModel
        .findWebsitesByUser(req.params.userId)
        .then(function (websites) {
            // console.log(websites);
            res.json(websites);
        });
}

// Retrieves the website in local websites array whose _id matches the websiteId parameter.
function findWebsiteById(req, res) {
    websiteModel
        .findWebsiteById(req.params.websiteId)
        .then(function (websites) {
            res.json(websites);
        });
}

// Updates the website in local websites array whose _id matches the websiteId parameter.
function updateWebsite(req, res) {
    var website = req.body;

    websiteModel
        .updateWebsite(req.params.websiteId, website)
        .then(function (status) {
            res.json(website);
        });
}

// Removes the website from local websites array whose _id matches the websiteId parameter.
function deleteWebsite(req, res) {

    websiteModel
        .deleteWebsite(req.params.websiteId)
        .then(function (status) {
            res.sendStatus(200);
        })
}
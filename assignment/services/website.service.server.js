/**
 * Server side website service
 * Author: Matthew Murphy
 */

var app = require('../../express.js');

var websites = [
    { "_id": "123", "name": "Facebook",    "developerId": "456", "description": "Lorem" },
    { "_id": "234", "name": "Tweeter",     "developerId": "456", "description": "Lorem" },
    { "_id": "456", "name": "Gizmodo",     "developerId": "456", "description": "Lorem" },
    { "_id": "890", "name": "Go",          "developerId": "123", "description": "Lorem" },
    { "_id": "567", "name": "Tic Tac Toe", "developerId": "123", "description": "Lorem" },
    { "_id": "678", "name": "Checkers",    "developerId": "123", "description": "Lorem" },
    { "_id": "789", "name": "Chess",       "developerId": "234", "description": "Lorem" }
];

app.post('/api/assignment/user/:userId/website', createWebsite);
app.get('/api/assignment/user/:userId/website', findWebsitesByUser);
app.get('/api/assignment/website/:websiteId', findWebsiteById);
app.put('/api/assignment/website/:websiteId', updateWebsite);
app.delete('/api/assignment/website/:websiteId', deleteWebsite);

// adds the website parameter instance to the local websites array.
// The new website's developerId is set to the userId parameter.
function createWebsite(req, res) {
    var website = req.body;

    website._id = (new Date()).getTime() + ""; // This seems really bad.
    websites.push(website);

    res.json(website);
}

// Retrieves the websites in local websites array whose developerId matches the parameter userId.
function findWebsitesByUser(req, res) {
    var userId = req.params.userId;

    var result = websites.filter(function(website) {
        return website.developerId === userId;
    });
    if (typeof result === 'undefined') {
        res.sendStatus(200);
        return;
    }
     res.json(result);
}

// Retrieves the website in local websites array whose _id matches the websiteId parameter.
function findWebsiteById(req, res) {
    var websiteId = req.params.websiteId;

    var result = websites.find(function (website) {
        return website._id === websiteId;
    });
    if (typeof result === 'undefined') {
        res.sendStatus(200);
        return;
    }
    res.json(result);
}

// Updates the website in local websites array whose _id matches the websiteId parameter.
function updateWebsite(req, res) {
    var websiteId = req.params.websiteId;
    var website = req.body;

    for (var ii = 0; ii < websites.length; ii++) {
        var site = websites[ii];
        if (site._id === websiteId) {
            website._id = websiteId;
            websites[ii] = website;
            break;
        }
    }
    res.sendStatus(200);
}

// Removes the website from local websites array whose _id matches the websiteId parameter.
function deleteWebsite(req, res) {
    var websiteId = req.params.websiteId;

    var website = websites.find(function(website) {
        return website._id === websiteId;
    });

    var index = websites.indexOf(website);
    websites.splice(index, 1);
    res.sendStatus(200);
}
/**
 * Server side page service
 * Author: Matthew Murphy
 */

var app = require('../../express.js');
var pageModel = require('../models/page/page.model.server');

app.post('/api/assignment/website/:websiteId/page', createPage);
app.get('/api/assignment/website/:websiteId/page', findAllPagesForWebsite);
app.get('/api/assignment/page/:pageId', findPageById);
app.put('/api/assignment/page/:pageId', updatePage);
app.delete('/api/assignment/page/:pageId', deletePage);


// adds the page parameter instance to the local pages array.
// The new pages's websiteId is set to the websiteId parameter.
function createPage(req, res) {
    var page = req.body;
    page._websiteId = req.params.websiteId;

    pageModel
        .createPage(page)
        .then(function (status) {
            res.json(page);
        });
}

// Retrieves the page in local websites array whose websiteId matches the parameter websiteId.
function findAllPagesForWebsite(req, res) {
    pageModel
        .findPagesByWebsite(req.params.websiteId)
        .then(function (pages) {
            res.json(pages);
        });
}

// Retrieves the page in local page array whose _id matches the pageId parameter.
function findPageById(req, res) {
    pageModel
        .findPageById(req.params.pageId)
        .then(function (page) {
            res.json(page);
        });
}

// Updates the page in local page array whose _id matches the pageId parameter.
function updatePage(req, res) {
    var pageId = req.params.pageId;
    var page = req.body;

    pageModel
        .updatePage(pageId, page)
        .then(function (status) {
            res.json(page);
        });
}

// Removes the page from local page array whose _id matches the pageId parameter.
function deletePage(req, res) {
    pageModel
        .deletePage(req.params.pageId)
        .then(function (status) {
            res.sendStatus(200);
        });
}

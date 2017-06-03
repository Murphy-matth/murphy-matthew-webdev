/**
 * Server side page service
 * Author: Matthew Murphy
 */

var app = require('../../express.js');

var pages = [
    { "_id": "321", "name": "Post 1", "websiteId": "456", "description": "Lorem" },
    { "_id": "432", "name": "Post 2", "websiteId": "456", "description": "Lorem" },
    { "_id": "543", "name": "Post 3", "websiteId": "456", "description": "Lorem" }
];

app.post('/api/assignment/website/:websiteId/page', createPage);
app.get('/api/assignment/website/:websiteId/page', findAllPagesForWebsite);
app.get('/api/assignment/page/:pageId', findPageById);
app.put('/api/assignment/page/:pageId', updatePage);
app.delete('/api/assignment/page/:pageId', deletePage);


// adds the page parameter instance to the local pages array.
// The new pages's websiteId is set to the websiteId parameter.
function createPage(req, res) {
    var page = req.body;

    // For now use a temporary time stamp until it is assigned by the database.
    page._id = (new Date()).getTime() + ""; // This seems really bad.
    pages.push(page);

    res.json(page);
}

// Retrieves the page in local websites array whose websiteId matches the parameter websiteId.
function findAllPagesForWebsite(req, res) {
    var websiteId = req.params.websiteId;

    var result = pages.filter(function(page) {
        return page.websiteId === websiteId;
    });
    if (typeof result === 'undefined') {
        res.sendStatus(200);
        return;
    }
    res.json(result);
}

// Retrieves the page in local page array whose _id matches the pageId parameter.
function findPageById(req, res) {
    var pageId = req.params.pageId;

    var result = pages.find(function(page) {
        return page._id === pageId;
    });
    if (typeof result === 'undefined') {
        res.sendStatus(200);
        return;
    }
    res.json(result);
}

// Updates the page in local page array whose _id matches the pageId parameter.
function updatePage(req, res) {
    var pageId = req.params.pageId;
    var page = req.body;

    for (var ii = 0; ii < pages.length; ii++) {
        var pageItr = pages[ii];
        if (pageItr._id === pageId) {
            page._id = pageId;
            pages[ii] = page;
            break;
        }
    }

    res.sendStatus(200);
}

// Removes the page from local page array whose _id matches the pageId parameter.
function deletePage(req, res) {
    var pageId = req.params.pageId;

    var page = pages.find(function(page) {
        return page._id === pageId;
    });

    var index = pages.indexOf(page);
    pages.splice(index, 1);

    res.sendStatus(200);
}

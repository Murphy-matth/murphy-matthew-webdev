/**
 * Server side user service
 * Author: Matthew Murphy
 */
var app = require('../../express.js');
var request = require('request');
var parse = require('xml-parser');

app.get('/api/project/rss/', getRssFeed);

function getRssFeed(req, res) {
    var url = req.query['url'];

    request(url, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var result = parseBody(body);
            res.send(result);
        }
    });
}

function parseBody(body) {
    // Convert the xml into json.
    var json = parse(body);

    // Need to determine what kind of RSS feed it is.
    // First check if there is a root node.
    var root = json['root'];
    if (root !== null) {
        return parseBodyWithRoot(json);
    }

    // Otherwise
    return [];
}

function parseBodyWithRoot(json) {
    var root = json['root'];

    // Extract the children nodes
    var children = root['children'];
    var items = children[0]['children'];

    var result = [];
    // Pull out all of the items
    for (var item in items) {
        if (items[item].name === 'item') {
            var temp = items[item].children;
            var newFeed = {
                'title': temp[0].content,
                'link': temp[1].content,
                'description': temp[2].content,
                'date': temp[4].content
            };
            result.push(newFeed);
        }
    }

    return result;
}
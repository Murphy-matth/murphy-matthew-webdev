/**
 * Server side user service
 * Author: Matthew Murphy
 */
var app = require('../../express.js');
var request = require('request');
var parser = require('xml2json');

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
    var options = {
        object: true,
        reversible: false,
        coerce: false,
        sanitize: true,
        trim: true,
        arrayNotation: false,
        alternateTextNode: false
    };

    // Convert the xml into json.
    var json = parser.toJson(body, options);
    var results = [];

    if (typeof json === 'undefined' || json === null) {
        console.log("RSS feed is null");
        return results;
    }

    results = extractItems(json);
    return results;
}

function extractItems(obj) {
    var results = [];

    var title = obj['title'];
    var link = obj['link'];
    var pubDate = obj['pubDate'];

    if (typeof title !== 'undefined'
        && typeof link !== 'undefined'
        && typeof pubDate !== 'undefined') {
        return [obj];
    }

    for (var field in obj) {
        if (obj.hasOwnProperty(field)) {
            var item = obj[field];
            if (item instanceof Object) {
                var found = extractItems(item);
                if (found.length > 0) {
                    results = results.concat(found);
                }
            }
        }
    }

    return results;
}

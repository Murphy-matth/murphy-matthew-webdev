/**
 * Server side user service
 * Author: Matthew Murphy
 */

var app = require('../../express.js');
var images = [
    {
        _id: 'M001169',
        url: 'http://bioguide.congress.gov/bioguide/photo/M/M001169.jpg'
    },
    {
        _id: 'B000575',
        url: 'http://bioguide.congress.gov/bioguide/photo/b/B000575.jpg'
    },
    {
        _id: 'A000360',
        url: 'http://bioguide.congress.gov/bioguide/photo/a/A000360.jpg'
    }];

app.get('/api/project/image/:id', findImageById);

function findImageById(req, res) {
    var id = req.params.id;
    for (var ii = 0; ii < images.length; ii++) {
        var temp = images[ii];
        if (temp._id === id) {
            res.send(temp.url);
            return;
        }
    }
    res.send("http://lorempixel.com/200/200");
}

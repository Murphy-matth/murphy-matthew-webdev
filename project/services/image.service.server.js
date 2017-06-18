/**
 * Server side user service
 * Author: Matthew Murphy
 */

var app = require('../../express.js');

app.get('/api/project/image/:id', findImageById);

function findImageById(req, res) {
    var id = req.params.id;
    var url = 'https://theunitedstates.io/images/congress/225x275/' + id + '.jpg';
    res.send(url);
}

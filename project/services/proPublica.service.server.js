/**
 * Service used to retrieve information from the ProPublica API
 */

var app = require('../../express.js');
var request = require('request');

// Change this if running on localhost.
var API_KEY = process.env.PRO_PUBLICIA_API_KEY;
var API_ENDPOINT = 'https://api.propublica.org/congress/v1/';
var SESSION_NUMBER = '115/';

app.get('/api/project/:chamber', findAllRepresentatives);
app.get('/api/project/:chamber/state/:state', findRepresentativeByState);
app.get('/api/project/:chamber/id/:rid', findRepresentativeById);

function findAllRepresentatives(req, res) {
    var chamber = req.params.chamber;

    if (chamber !== 'senate' && chamber !== 'house') {
        res.sendStatus(404);
        return;
    }

    var url = API_ENDPOINT + SESSION_NUMBER + chamber + '/members.json';
    request({
        headers: {
            'X-API-Key': API_KEY
        },
        uri: url,
        method: 'GET'
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            res.send(body);
        }
    });}

function findRepresentativeByState(req, res) {
    var chamber = req.params.chamber;
    var state = req.params.state;

    if (chamber !== 'senate' && chamber !== 'house') {
        res.sendStatus(404);
        return;
    }

    var url = API_ENDPOINT + 'members/' + chamber + '/' + state + '/current.json';
    request({
        headers: {
            'X-API-Key': API_KEY
        },
        uri: url,
        method: 'GET'
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            res.send(body);
        } else {
            res.sendStatus(404);
        }
    });
}

function findRepresentativeById(req, res) {
    var chamber = req.params.chamber;
    var id = req.params.rid;

    if (chamber !== 'senate' && chamber !== 'house') {
        res.sendStatus(404);
        return;
    }

    var url = API_ENDPOINT + 'members/' + id + '.json';
    request({
        headers: {
            'X-API-Key': API_KEY
        },
        uri: url,
        method: 'GET'
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            res.send(body);
        }
    });
}

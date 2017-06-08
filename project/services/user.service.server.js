/**
 * Server side user service
 * Author: Matthew Murphy
 */

var app = require('../../express.js');
var users = [
    {_id: "123",
        username: "matt",
        password: "thisisasecurepassword",
        firstName: "Matt",
        lastName: "Murphy",
        email: "murphy1022@gmail.com",
        photo: "http://lorempixel.com/200/200",
        dateJoined: "Oct 22, 2005",
        games : {
            texasHoldem: {
                name: "Texas Hold'em",
                stats: [
                    {name: 'Total Hands', value: 500},
                    {name: 'Total Hands Played', value: 100},
                    {name: 'Total BB Played', value: 50},
                    {name: 'Total SB Played', value: 15},
                    {name: 'Total Buttons Played', value: 25},
                    {name: 'Total UTG Played', value: 10}
                ]
            }
        },
        followers: {
            _id: "456"
        }},
    {_id: "456",
        username: "bob",
        password: "bob",
        firstName: "Bob",
        lastName: "Beaver",
        email: "beaverfan@gmail.com",
        photo: "http://lorempixel.com/200/200",
        dateJoined: "Jan 1, 2017",
        games : {
            texasHoldem: {
                name: "Texas Hold'em",
                stats: [
                    {name: 'Total Hands', value: 780},
                    {name: 'Total Hands Played', value: 200},
                    {name: 'Total BB Played', value: 86},
                    {name: 'Total SB Played', value: 15},
                    {name: 'Total Buttons Played', value: 75},
                    {name: 'Total UTG Played', value: 14}
                ]
            }
        },
        followers: {
        }}
];

app.post('/api/project/user', createUser);
app.get('/api/project/user/:uid', findUserById);
app.get('/api/project/user', findUserByCredentials);
app.put('/api/project/user/:uid', updateUser);
app.delete('/api/project/user/:uid', deleteUser);

function updateUser(req, res) {
    var user = req.body;
    var userId = req.params.uid;

    for (var ii = 0; ii < users.length; ii++) {
        var tempUser = users[ii];
        if (tempUser._id === userId) {
            user._id = userId;
            users[ii] = user;
            res.send(user);
            return;
        }
    }
    res.sendStatus(404);
}

function deleteUser(req, res) {
    res.sendStatus(200);
}

// Creates the given user
function createUser(req, res) {
    var user = req.body;

    user._id = (new Date()).getTime() + ""; // This seems really bad.
    user.dateJoined = new Date();
    users.push(user);

    res.send(user);
}

// Returns the user whose username and password match the username and password parameters.
function findUserByCredentials(req, res) {
    var username = req.query['username'];
    var password = req.query['password'];

    if (typeof password === 'undefined') {
        return findUserByUsername(res, username);
    } else {
        return findUserByUsernameAndPassword(res, username, password);
    }
}

// Returns the user whose username match's the username in the user's array.
function findUserByUsername(res, username) {
    var result = users.find(function(user) {
        return user.username === username;
    });
    if (typeof result === 'undefined') {
         res.sendStatus(404);
    } else {
        res.send(result);
    }
}

// Returns the user whose username and password match's the username and password in the user's array.
function findUserByUsernameAndPassword(res, username, password) {
    var result = users.find(function(user) {
        return user.username === username && user.password === password;
    });
    if (typeof result === 'undefined') {
        res.sendStatus(404);
    } else {
        res.send(result);
    }
}

// Returns the user in local users array whose _id matches the userId parameter.
function findUserById(req, res) {
    var id = req.params.uid;
    var result = users.find(function(user) {
        return user._id === id;
    });
    if (result === 'undefined') {
        return res.send(404);
    } else {
        res.send(result);
    }
}

/**
 * Server side user service
 * Author: Matthew Murphy
 */

var app = require('../../express.js');
var users = [
    {_id: "123", username: "alice",    password: "alice",    firstName: "Alice",  lastName: "Wonder",
        email: "alice@wonderland.net" },
    {_id: "234", username: "bob",      password: "bob",      firstName: "Bob",    lastName: "Marley",
        email: "bob@bob.net" },
    {_id: "345", username: "charly",   password: "charly",   firstName: "Charly", lastName: "Garcia",
        email: "charly@charly.net" },
    {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose",   lastName: "Annunzi",
        email: "jose@jannunzi.net" }
];

app.get('/api/assignment/user/:uid', findUserById);
app.get('/api/assignment/user', findUserByCredentials);
app.post('/api/assignment/user', createUser);
app.put('/api/assignment/user/:uid', updateUser);
app.delete('/api/assignment/user:uid', deleteUser);

// Deletes the given user whose _id matches the uid
function deleteUser(req, res) {
    var id = req.params.uid;
    var user = users.find(function(user) {
        return user._id === id;
    });

    var index = users.indexOf(user);
    users.splice(index, 1);

    res.sendStatus(200);
}

// Updates the given user whose _id matches the uid
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

// Creates the given user
function createUser(req, res) {
    var user = req.body;

    user._id = (new Date()).getTime() + ""; // This seems really bad.
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

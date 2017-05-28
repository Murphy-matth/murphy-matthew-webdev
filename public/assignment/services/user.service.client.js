/**
 * User Service
 * Author: Matthew Murphy
 */
(function() {
    angular
        .module("WebAppMaker")
        .factory("userService", userService);

    function userService() {

        var users = [
            {_id: "123", username: "alice",    password: "alice",    firstName: "Alice",  lastName: "Wonder",
             email: "alice@wonderland.net" },
            {_id: "234", username: "bob",      password: "bob",      firstName: "Bob",    lastName: "Marley",
                email: "bob@bob.net" },
            {_id: "345", username: "charly",   password: "charly",   firstName: "Charly", lastName: "Garcia",
                email: "charly@charly.net" },
            {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose",   lastName: "Annunzi",
                email: "jose@jannunzi.net" },
        ];

        var api = {
            "createUser"   : createUser,
            "findUserById" : findUserById,
            "findUserByUsername" : findUserByUsername,
            "findUserByCredentials" : findUserByCredentials,
            "updateUser" : updateUser,
            "deleteUser" : deleteUser
        };
        return api;

        // Adds the user parameter instance to the local users array. Returns the new user.
        function createUser(user) {
            var newUser = angular.copy(user);

            // For now use a temporary time stamp until it is assigned by the database.
            newUser._id = (new Date()).getTime() + ""; // This seems really bad.
            users.push(newUser);

            return newUser;
        }

        // Returns the user in local users array whose _id matches the userId parameter.
        function findUserById(id) {
            return users.find(function(user) {
                return user._id === id;
            });
        }

        // Returns the user in local users array whose username matches the parameter username.
        function findUserByUsername(username) {
            var result = users.find(function(user) {
                return user.username === username;
            });
            if (typeof result === 'undefined') {
                return null;
            }
            return result;
        }

        // Returns the user whose username and password match the username and password parameters.
        function findUserByCredentials(username, password) {
            var result = users.find(function(user) {
                return user.username === username && user.password === password;
            });
            if (typeof result === 'undefined') {
                return null;
            }
            return result;
        }

        // Updates the user in local users array whose _id matches the userId parameter.
        function updateUser(userId, user) {
            for (var ii = 0; ii < users.length; ii++) {
                var tempUser = users[ii];
                if (tempUser._id === userId) {
                    user._id = userId;
                    users[ii] = user;
                    break;
                }
            }
        }

        // Removes the user whose _id matches the userId parameter.
        function deleteUser(userId) {
            var user = users.find(function(user) {
                return user._id === id;
            });

            var index = users.indexOf(user);
            users.splice(index, 1);
        }
    }
})();

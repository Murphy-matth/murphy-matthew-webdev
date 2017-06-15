/**
 * User Service
 * Author: Matthew Murphy
 */
(function() {
    "use strict";

    angular
        .module("WebAppMaker")
        .factory("userService", userService);

    function userService($http) {

        var baseUrl = "/api/assignment/user/";

        var api = {
            "createUser"   : createUser,
            "findUserById" : findUserById,
            "findUserByUsername" : findUserByUsername,
            "findUserByCredentials" : findUserByCredentials,
            "updateUser" : updateUser,
            "deleteUser" : deleteUser,
            "login": login,
            "logout": logout,
            "register": register,
            "checkLoggedIn": checkLoggedIn,
            "findCurrentUser": findCurrentUser
        };
        return api;

        function findCurrentUser() {
            var url = "/api/assignment/current";

            console.log(url);
            return $http.get(url)
                .then(function (response) {
                    return response.data;
                })
        }

        function login(username, password) {
            var credentials = {
                username: username,
                password: password
            };

            return $http
                .post("/api/assignment/login", credentials)
                .then(function (response) {
                    return response.data;
                });
        }

        function logout(user) {
            return $http
                .post("/api/assignment/logout")
                .then(function (response) {
                    return response.data;
                })
        }

        function register(user) {
            return $http
                .post("/api/assignment/register", user)
                .then(function (response) {
                    return response.data;
                })
        }

        function checkLoggedIn() {
            var url = "/api/assignment/checkLoggedIn";
            return $http.get(url)
                .then(function (response) {
                    return response.data;
                });
        }


        // Adds the user parameter instance. Returns the new user.
        function createUser(user) {
            var newUser = angular.copy(user);
            return $http.post(baseUrl, newUser)
                .then(function(response) {
                    return response.data;
                });
        }

        // Returns the user whose _id matches the id.
        function findUserById(id) {
            return sendGet(baseUrl + id);
        }

        // Returns the user whose username matches the parameter username.
        function findUserByUsername(username) {
            return sendGet(baseUrl + "?username=" + username);
        }

        // Returns the user whose username and password match the username and password parameters.
        function findUserByCredentials(username, password) {
            return sendGet(baseUrl + "?username=" + username + "&password=" + password);
        }

        // Updates the user in local users array whose _id matches the userId parameter.
        function updateUser(userId, user) {
            var url = baseUrl + userId;
            return $http.put(url, user)
                .then(function (response) {
                    return response.data;
                });
        }

        // Removes the user whose _id matches the userId parameter.
        function deleteUser(userId) {
            var url = baseUrl + userId;
            return $http.delete(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function sendGet(url) {
            return $http.get(url)
                .then(function (response) {
                    return response.data;
                });
        }
    }
})();

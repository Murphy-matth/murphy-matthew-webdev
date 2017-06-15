/**
 * User Service
 * Author: Matthew Murphy
 */
(function() {
    "use strict";

    angular
        .module("KnowYourRep")
        .factory("userService", userService);

    function userService($http) {

        var baseUrl = "/api/project/user/";

        var api = {
            "createUser"   : createUser,
            "findUserById" : findUserById,
            "findUserByUsername" : findUserByUsername,
            "findUserByCredentials" : findUserByCredentials,
            "updateUser" : updateUser,
            "deleteUser" : deleteUser,
            "updatePassword": updatePassword,
            "followUser": followUser,
            "removeFollowing": removeFollowing,
            "removeFollower": removeFollower,
            "findFollowersByUser": findFollowersByUser,
            "findFollowingByUser": findFollowingByUser,
            "login": login,
            "logout": logout,
            "register": register,
            "checkLoggedIn": checkLoggedIn

        };
        return api;

        function login(username, password) {
            var credentials = {
                username: username,
                password: password
            };

            return $http
                .post("/api/project/login", credentials)
                .then(function (response) {
                    return response.data;
                })
        }

        function logout(user) {
            return $http
                .post("/api/project/logout")
                .then(function (response) {
                    return response.data;
                })
        }

        function register(user) {
            return $http
                .post("/api/project/register", user)
                .then(function (response) {
                    return response.data;
                })
        }

        function checkLoggedIn() {
            var url = "/api/project/checkLoggedIn";
            return $http.get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function removeFollower(userId, followerId) {
            return $http
                .delete(baseUrl + userId + '/follower/' + followerId)
                .then(function (response) {
                    return response.data;
                });
        }

        function removeFollowing(userId, followerId) {
            return $http
                .delete(baseUrl + userId + '/following/' + followerId)
                .then(function (response) {
                    return response.data;
                });
        }

        function findFollowingByUser(userId) {
            return sendGet(baseUrl + userId + '/following');
        }

        function findFollowersByUser(userId) {
            return sendGet(baseUrl + userId + '/followers');
        }

        // Follows the given user.
        function followUser(userId, followerId) {
            return sendGet(baseUrl + userId + '/follower/' + followerId);
        }

        function updatePassword(userId, password) {
            return sendGet(baseUrl + userId + '/password/' + password);
        }

        // Adds the user parameter instance. Returns the new user.
        function createUser(user) {
            var newUser = angular.copy(user);
            return $http.post(baseUrl, newUser)
                .then(function(response) {
                    return response.data;
                });
        }

        // Returns the user in local users array whose _id matches the userId parameter.
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

        // Updates the user whose _id matches the userId parameter. Returns the user on success.
        function updateUser(userId, user) {
            var url = baseUrl + userId;
            return $http.put(url, user)
                .then(function (response) {
                    return response.data;
                });
        }

        // Removes the user whose _id matches the userId parameter.
        function deleteUser(userId) {
            var user = users.find(function(user) {
                return user._id === id;
            });

            var index = users.indexOf(user);
            users.splice(index, 1);
        }

        function sendGet(url) {
            return $http.get(url)
                .then(function (response) {
                    return response.data;
                });
        }
    }
})();

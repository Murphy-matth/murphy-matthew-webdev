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

        return {
            "findUserById" : findUserById,
            "updateUser" : updateUser,
            "updatePassword": updatePassword,
            "followUser": followUser,
            "removeFollowing": removeFollowing,
            "removeFollower": removeFollower,
            "findFollowersByUser": findFollowersByUser,
            "findFollowingByUser": findFollowingByUser,
            "login": login,
            "logout": logout,
            "register": register,
            "checkLoggedIn": checkLoggedIn,
            "checkAdmin": checkAdmin,
            "findCurrentUser": findCurrentUser,
            "findFollowing": findFollowing,
            "findFollowers": findFollowers
        };

        function findCurrentUser() {
            return sendGet('/api/project/current');
        }

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
            return sendGet('/api/project/checkLoggedIn');
        }

        function checkAdmin() {
            return sendGet('/api/project/checkAdmin');
        }

        function removeFollower(userId, followerId) {
            return $http
                .delete('/api/project/follower/' + followerId)
                .then(function (response) {
                    return response.data;
                });
        }

        function removeFollowing(userId, followerId) {
            return $http
                .delete('/api/project/following/' + followerId)
                .then(function (response) {
                    return response.data;
                });
        }

        function findFollowing() {
            return sendGet('/api/project/following');
        }

        function findFollowers() {
            return sendGet('/api/project/followers');
        }

        function findFollowingByUser(userId) {
            return sendGet(baseUrl + userId + '/following');
        }

        function findFollowersByUser(userId) {
            return sendGet(baseUrl + userId + '/followers');
        }

        // Follows the given user.
        function followUser(followerId) {
            return sendGet('/api/project/follower/' + followerId);
        }

        function updatePassword(oldPass, newPass) {
            return $http
                .post('/api/project/password', {
                    new: newPass,
                    old: oldPass
                })
                .then(function (response) {
                    return response.data;
                });
        }

        // Returns the user in local users array whose _id matches the userId parameter.
        // Returns the user whose _id matches the id.
        function findUserById(id) {
            return sendGet(baseUrl + id);
        }

        // Updates the user whose _id matches the userId parameter. Returns the user on success.
        function updateUser(user) {
            return $http.put(baseUrl, user)
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

/**
 * Admin Service.
 * Author: Matthew Murphy
 */

(function() {
    "use strict";

    angular
        .module('KnowYourRep')
        .factory('adminService', adminService);

    function adminService($http) {

        var baseUrl = "/api/project/admin/";

        return {
            "findAllUsers"   : findAllUsers,
            "deleteUser": deleteUser,
            "updateUser": updateUser,
            "createUser": createUser
        };

        function createUser(user) {
            var url = baseUrl + 'user/create';

            return $http
                .post(url, user)
                .then(function (response) {
                    return response.data;
                }, function (err) {
                    console.log(err);
                    return err;
                })
        }

        function updateUser(user) {
            var url = baseUrl + 'user';

            return $http
                    .post(url, user)
                    .then(function (response) {
                        return response.data;
                    }, function (err) {
                        console.log(err);
                        return err;
                    })
        }

        function deleteUser(userId) {
            if (userId === null || typeof userId === 'undefined') {
                console.log("UserId cannot be null");
                return;
            }
            var url = baseUrl + "user/" + userId;

            return $http
                .delete(url)
                .then(function (response) {
                    return response.data;
                }, function (err) {
                    console.log(err);
                    return err;
                })
        }

        function findAllUsers() {
            var newUrl = baseUrl + "users";

            return $http
                .get(newUrl)
                .then(function(response) {
                    return response.data;
                }, function (err) {
                    console.log(err);
                    return err;
                })
        }
    }
})();

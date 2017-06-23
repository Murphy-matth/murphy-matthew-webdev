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
            "createUser": createUser,
            "findAllReps": findAllReps,
            "deleteRep": deleteRep,
            "updateRep": updateRep
        };

        function updateRep(rep) {
            var url = baseUrl + 'rep';

            return $http
                .post(url, rep)
                .then(function (response) {
                    return response.data;
                }, function (err) {
                    console.log(err);
                    return err;
                })
        }

        function deleteRep(repId) {
            if (repId === null || typeof repId === 'undefined') {
                console.log("RepId cannot be null");
                return;
            }
            var url = baseUrl + "rep/" + repId;

            return $http
                .delete(url)
                .then(function (response) {
                    return response.data;
                }, function (err) {
                    console.log(err);
                    return err;
                })
        }

        function findAllReps() {
            var newUrl = baseUrl + "reps";

            return $http
                .get(newUrl)
                .then(function(response) {
                    return response.data;
                }, function (err) {
                    console.log(err);
                    return err;
                })
        }

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

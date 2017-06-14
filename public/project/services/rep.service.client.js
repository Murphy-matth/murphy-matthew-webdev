/**
 * RepService
 * Author: Matthew Murphy
 */
(function() {
    "use strict";

    angular
        .module("KnowYourRep")
        .factory("repService", repService);

    function repService($http) {

        var BASE_URL = '/api/project/';

        var api = {
            "createRep"   : createRep,
            "deleteRep"   : deleteRep,
            "findRepsByUser": findRepsByUser
        };
        return api;

        function deleteRep(userId, repId) {
            var url = BASE_URL + 'user/' + userId + '/rep/' + repId;
            return $http
                .delete(url)
                .then(function (response) {
                    return response.data;
                })
        }

        function findRepsByUser(userId) {
            var url = BASE_URL + 'rep/' + userId + '/reps';
            return $http
                .get(url)
                .then(function (response) {
                    return response.data;
                })
        }

        function createRep(userId, rep) {
            var url = BASE_URL + 'rep/' + userId;
            console.log(url);

            return $http
                .post(url, rep)
                .then(function (response) {
                    return response.data;
                });
        }
    }
})();

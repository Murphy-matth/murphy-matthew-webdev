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

        return {
            "createRep"   : createRep,
            "deleteRep"   : deleteRep,
            "findRepsByUser": findRepsByUser,
            "findReps": findReps
        };

        function deleteRep(repId) {
            var url = BASE_URL + 'rep/' + repId;
            return $http
                .delete(url)
                .then(function (response) {
                    return response.data;
                })
        }

        function findReps() {
            var url = BASE_URL + "reps/";
            return $http
                .get(url)
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

        function createRep(rep) {
            var url = BASE_URL + 'rep/';

            return $http
                .post(url, rep)
                .then(function (response) {
                    return response.data;
                });
        }
    }
})();

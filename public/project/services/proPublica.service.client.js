/**
 * proPublicaService
 * Author: Matthew Murphy
 */
(function() {
    "use strict";

    angular
        .module("KnowYourRep")
        .factory("proPublicaService", proPublicaService);

    function proPublicaService($http) {

        var BASE_URL = '/api/project/';

        return {
            "findAllRepresentatives"   : findAllRepresentatives,
            'findRepresentativeByState' : findRepresentativeByState,
            'findRepresentativeById': findRepresentativeById
        };

        function findAllRepresentatives(chamber) {
            chamber = chamber.toLowerCase();
            if (chamber !== 'senate' && chamber !== 'house') {
                console.error("Invalid type: " + chamber);
                return;
            }

            var url = BASE_URL + chamber.toLowerCase();
            return sendGet(url);
        }

        function findRepresentativeByState(state, chamber) {
            chamber = chamber.toLowerCase();
            if (chamber !== 'senate' && chamber !== 'house') {
                console.error("Invalid type: " + chamber);
                return;
            }

            var url = BASE_URL + chamber.toLowerCase() + '/state/' + state;
            return sendGet(url);
        }

        function findRepresentativeById(id, chamber) {
            chamber = chamber.toLowerCase();
            if (chamber !== 'senate' && chamber !== 'house') {
                console.error("Invalid type: " + chamber);
                return;
            }

            var url = BASE_URL + chamber.toLowerCase() + '/id/' + id;
            return sendGet(url);
        }

        function sendGet(url) {
            return $http
                .get(url)
                .then(function(response) {
                    return response.data.results;
                }, function(err) {
                    return 'ERROR';
                })
        }
    }
})();

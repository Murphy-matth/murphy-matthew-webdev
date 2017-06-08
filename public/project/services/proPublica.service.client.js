/**
 * proPublicaService
 * Author: Matthew Murphy
 */
(function() {
    angular
        .module("KnowYourRep")
        .factory("proPublicaService", proPublicaService);

    function proPublicaService($http) {

        var BASE_URL = '/api/project/';

        var api = {
            "findAllRepresentatives"   : findAllRepresentatives,
            'findRepresentativeByState' : findRepresentativeByState,
            'findRepresentativeById': findRepresentativeById
        };
        return api;

        function findAllRepresentatives(chamber) {
            if (chamber !== 'senate' && chamber !== 'house') {
                console.error("Invalid type: " + chamber);
                return;
            }

            var url = BASE_URL + chamber.toLowerCase();
            return sendGet(url);
        }

        function findRepresentativeByState(state, chamber) {
            if (chamber !== 'senate' && chamber !== 'house') {
                console.error("Invalid type: " + chamber);
                return;
            }

            var url = BASE_URL + chamber.toLowerCase() + '/state/' + state;
            console.log(url);
            return sendGet(url);
        }

        function findRepresentativeById(id, chamber) {
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

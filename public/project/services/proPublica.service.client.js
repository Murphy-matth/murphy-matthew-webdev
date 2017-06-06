/**
 * proPublicaService
 * Author: Matthew Murphy
 */
(function() {
    angular
        .module("KnowYourRep")
        .factory("proPublicaService", proPublicaService);

    function proPublicaService($http) {

        var API_KEY = 'S7VSk7ORmL4dZ1JhpZkuD6P9I94ntJwn4WsFv2HV';
        var API_ENDPOINT = 'https://api.propublica.org/congress/v1/';
        var SESSION_NUMBER = '115/';

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

            var url = API_ENDPOINT + SESSION_NUMBER + chamber + '/members.json';
            return sendGet(url);
        }

        function findRepresentativeByState(state, chamber) {
            if (chamber !== 'senate' && chamber !== 'house') {
                console.error("Invalid type: " + chamber);
                return;
            }

            var url = API_ENDPOINT + 'members/' + chamber + '/' + state + '/current.json';
            return sendGet(url);
        }

        function findRepresentativeById(id, chamber) {
            if (chamber !== 'senate' && chamber !== 'house') {
                console.error("Invalid type: " + chamber);
                return;
            }

            var url = API_ENDPOINT + 'members/' + id + '.json';
            return sendGet(url);
        }

        function sendGet(url) {
            return $http
                .get(url, {
                    headers: {'X-API-Key': API_KEY}})
                .then(function(response) {
                    if (response.data.status === 'OK') {
                        return response.data.results;
                    }
                    return 'ERROR';
                })
        }
    }
})();

/**
 * Service used to retrieve the photos of a specific person from the senate or the house.
 * Author: Matthew Murphy
 */

(function() {
    angular
        .module("KnowYourRep")
        .factory("imageService", imageService);

    function imageService($http) {

        var baseUrl = "/api/project/image/";

        var api = {
            "findImageById"   : findImageById
        };
        return api;

        function findImageById(id) {
            var url = baseUrl + id;
            return $http
                .get(url)
                .then(function(response) {
                    return response.data;
                })
        }
    }
})();


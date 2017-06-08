/**
 * Simple RSS feed parser.
 * Author: Matthew Murphy
 */

(function() {
    angular
        .module('KnowYourRep')
        .factory('feedService', feedService);

    function feedService($http) {

        var baseUrl = "/api/project/rss/";

        var api = {
            "parseFeed"   : parseFeed
        };
        return api;

        function parseFeed(url) {
            var newUrl = baseUrl + "?url=" + url;

            return $http
                .get(newUrl)
                .then(function(response) {
                    return response.data;
                })
        }
    }

})();


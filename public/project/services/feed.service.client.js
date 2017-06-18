/**
 * Simple RSS feed parser.
 * Author: Matthew Murphy
 */

(function() {
    "use strict";

    angular
        .module('KnowYourRep')
        .factory('feedService', feedService);

    function feedService($http) {

        var baseUrl = "/api/project/rss/";

        return {
            "parseFeed"   : parseFeed
        };

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

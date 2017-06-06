/**
 * Simple RSS feed parser.
 * Author: Matthew Murphy
 */

(function() {
    angular
        .module('KnowYourRep')
        .factory('feedService', feedService);

    function feedService($http, $sce) {
        return {
            parseFeed: function (url) {
                var trust = $sce.trustAsResourceUrl(trust)
                console.log(trust);
                $http
                    .get(url)
                    .then(function(response) {
                        console.log(response);
                    })
            }
        }
    }

})();


/**
 * Website Service
 * Author: Matthew Murphy
 */
(function() {
    angular
        .module("WebAppMaker")
        .factory("WebsiteService", WebsiteService);

    function WebsiteService($http) {

        var baseUrl = '/api/assignment/';

        var api = {
            "createWebsite"   : createWebsite,
            "findWebsitesByUser" : findWebsitesByUser,
            "findWebsiteById" : findWebsiteById,
            "updateWebsite" : updateWebsite,
            "deleteWebsite" : deleteWebsite
        };
        return api;

        // adds the website parameter instance.
        // The new website's developerId is set to the userId parameter.
        function createWebsite(userId, website) {
            var newWebsite = angular.copy(website);
            var url = baseUrl + 'user/' + userId + '/website';

            return $http.post(url, newWebsite)
                .then(function (response) {
                    return response.data;
                })
        }

        // Retrieves the websites whose developerId matches the parameter userId.
        function findWebsitesByUser(userId) {
            var url = baseUrl + 'user/' + userId + '/website';

            return $http.get(url)
                .then(function (response) {
                    return response.data;
                })
        }

        // Retrieves the website whose _id matches the websiteId parameter.
        function findWebsiteById(websiteId) {
            var url = baseUrl + 'website/' + websiteId;

            return $http.get(url)
                .then(function (response) {
                    return response.data;
                })
        }

        // Updates the website whose _id matches the websiteId parameter.
        function updateWebsite(websiteId, website) {
            var url = baseUrl + 'website/' + websiteId;

            return $http.put(url, website)
                .then(function (response) {
                    return response.data;
                })
        }

        // Removes the website whose _id matches the websiteId parameter.
        function deleteWebsite(websiteId) {
            var url = baseUrl + 'website/' + websiteId;

            return $http.delete(url)
                .then(function (response) {
                    return response.data;
                })
        }
    }
})();

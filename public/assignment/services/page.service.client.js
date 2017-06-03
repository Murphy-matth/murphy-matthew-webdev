/**
 * Page Service
 * Author: Matthew Murphy
 */
(function() {
    angular
        .module("WebAppMaker")
        .factory("PageService", PageService);

    function PageService($http) {

        var baseUrl = '/api/assignment/';

        var api = {
            "createPage"   : createPage,
            "findPagesByWebsiteId" : findPagesByWebsiteId,
            "findPageById" : findPageById,
            "updatePage" : updatePage,
            "deletePage" : deletePage
        };
        return api;

        // Adds the page parameter instance to the local pages array.
        // The new page's websiteId is set to the websiteId parameter.
        function createPage(websiteId, page) {
            var newPage = angular.copy(page);

            var url = baseUrl + 'website/' + websiteId + '/page';

            return $http.post(url, newPage)
                .then(function (response) {
                    return response.data;
                })
        }

        // Retrieves the pages in local pages array whose websiteId matches the parameter websiteId.
        function findPagesByWebsiteId(websiteId) {
            var url = baseUrl + 'website/' + websiteId + '/page';

            return $http.get(url)
                .then(function (response) {
                    return response.data;
                })
        }

        // Retrieves the page in local pages array whose _id matches the pageId parameter.
        function findPageById(pageId) {
            var url = baseUrl + 'page/' + pageId;

            return $http.get(url)
                .then(function (response) {
                    return response.data;
                })
        }

        // Updates the page in local pages array whose _id matches the pageId parameter.
        function updatePage(pageId, page) {
            var url = baseUrl + 'page/' + pageId;

            return $http.put(url, page)
                .then(function (response) {
                    return response.data;
                })
        }

        // Removes the page from local pages array whose _id matches the pageId parameter.
        function deletePage(pageId) {
            var url = baseUrl + 'page/' + pageId;

            return $http.delete(url)
                .then(function (response) {
                    return response.data;
                })
        }
    }
})();

/**
 * Page Service
 * Author: Matthew Murphy
 */
(function() {
    angular
        .module("WebAppMaker")
        .factory("PageService", PageService);

    function PageService() {
        var pages = [
            { "_id": "321", "name": "Post 1", "websiteId": "456", "description": "Lorem" },
            { "_id": "432", "name": "Post 2", "websiteId": "456", "description": "Lorem" },
            { "_id": "543", "name": "Post 3", "websiteId": "456", "description": "Lorem" }
        ];

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

            // For now use a temporary time stamp until it is assigned by the database.
            newPage._id = (new Date()).getTime() + ""; // This seems really bad.
            pages.push(newPage);

            return newPage;
        }

        // Retrieves the pages in local pages array whose websiteId matches the parameter websiteId.
        function findPagesByWebsiteId(websiteId) {
            var result = pages.filter(function(page) {
                return page.websiteId === websiteId;
            });
            if (typeof result === 'undefined') {
                return null;
            }
            return result;
        }

        // Retrieves the page in local pages array whose _id matches the pageId parameter.
        function findPageById(pageId) {
            var result = pages.find(function(page) {
                return page._id === pageId;
            });
            if (typeof result === 'undefined') {
                return null;
            }
            return result;
        }

        // Updates the page in local pages array whose _id matches the pageId parameter.
        function updatePage(pageId, page) {
            for (var ii = 0; ii < pages.length; ii++) {
                var pageItr = pages[ii];
                if (pageItr._id === pageId) {
                    page._id = pageId;
                    pages[ii] = page;
                    break;
                }
            }
        }

        // Removes the page from local pages array whose _id matches the pageId parameter.
        function deletePage(pageId) {
            var page = pages.find(function(page) {
                return page._id === pageId;
            });

            var index = pages.indexOf(page);
            pages.splice(index, 1);
        }
    }
})();

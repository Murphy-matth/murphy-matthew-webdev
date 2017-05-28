/**
 * Website Service
 * Author: Matthew Murphy
 */
(function() {
    angular
        .module("WebAppMaker")
        .factory("WebsiteService", WebsiteService);

    function WebsiteService() {
        var websites = [
            { "_id": "123", "name": "Facebook",    "developerId": "456", "description": "Lorem" },
            { "_id": "234", "name": "Tweeter",     "developerId": "456", "description": "Lorem" },
            { "_id": "456", "name": "Gizmodo",     "developerId": "456", "description": "Lorem" },
            { "_id": "890", "name": "Go",          "developerId": "123", "description": "Lorem" },
            { "_id": "567", "name": "Tic Tac Toe", "developerId": "123", "description": "Lorem" },
            { "_id": "678", "name": "Checkers",    "developerId": "123", "description": "Lorem" },
            { "_id": "789", "name": "Chess",       "developerId": "234", "description": "Lorem" }
        ];

        var api = {
            "createWebsite"   : createWebsite,
            "findWebsitesByUser" : findWebsitesByUser,
            "findWebsiteById" : findWebsiteById,
            "updateWebsite" : updateWebsite,
            "deleteWebsite" : deleteWebsite
        };
        return api;

        // adds the website parameter instance to the local websites array.
        // The new website's developerId is set to the userId parameter.
        function createWebsite(userId, website) {
            var newWebsite = angular.copy(website);

            // For now use a temporary time stamp until it is assigned by the database.
            newWebsite._id = (new Date()).getTime() + ""; // This seems really bad.
            websites.push(newWebsite);

            return newWebsite;
        }

        // Retrieves the websites in local websites array whose developerId matches the parameter userId.
        function findWebsitesByUser(userId) {
            var result = websites.filter(function(website) {
                return website.developerId === userId;
            });
            if (typeof result === 'undefined') {
                return null;
            }
            return result;
        }

        // Retrieves the website in local websites array whose _id matches the websiteId parameter.
        function findWebsiteById(websiteId) {
            var result = websites.find(function (website) {
                return website._id === websiteId;
            });
            if (typeof result === 'undefined') {
                return null;
            }
            return result;
        }

        // Updates the website in local websites array whose _id matches the websiteId parameter.
        function updateWebsite(websiteId, website) {
            for (var ii = 0; ii < websites.length; ii++) {
                var site = websites[ii];
                if (site._id === websiteId) {
                    website._id = websiteId;
                    websites[ii] = website;
                    break;
                }
            }
        }

        // Removes the website from local websites array whose _id matches the websiteId parameter.
        function deleteWebsite(websiteId) {
            var website = websites.find(function(website) {
                return website._id === websiteId;
            });

            var index = websites.indexOf(website);
            websites.splice(index, 1);
        }
    }
})();

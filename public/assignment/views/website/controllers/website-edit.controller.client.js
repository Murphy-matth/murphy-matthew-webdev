// Website-new Controller
(function() {
    angular
        .module("WebAppMaker")
        .controller("websiteEditController", websiteEditController);


    function websiteEditController($routeParams, $location, WebsiteService) {
        var vm = this;

        function init() {
            vm.userId = $routeParams['uid'];
            vm.websiteId = $routeParams['wid'];
            WebsiteService
                .findWebsiteById(vm.websiteId)
                .then(function(website) {
                    vm.website = website;
                    vm.editableWebsite = angular.copy(vm.website);
                });
            WebsiteService
                .findWebsitesByUser(vm.userId)
                .then(function(websites) {
                    vm.websites = websites;
                })
        }
        init();

        // Event Handlers.
        vm.deleteWebsite = deleteWebsite;
        vm.updateWebsite = updateWebsite;

        function deleteWebsite() {
            WebsiteService
                .deleteWebsite(vm.websiteId)
                .then(function(response) {
                    // Navigate back to the website list page.
                    $location.url("/user/" + vm.userId + "/website");
                })

        }

        function updateWebsite(webName, webDescription) {
            vm.nameError = null;
            vm.descriptionError = null;

            if (typeof webName === 'undefined') {
                vm.nameError = "Please enter a website name."
                return;
            }
            if (typeof webDescription === 'undefined') {
                vm.nameError = "Please enter a website description."
                return;
            }

            var website = {
                name: webName,
                description: webDescription,
                developerId: vm.userId
            };
            WebsiteService
                .updateWebsite(vm.websiteId, website)
                .then(function(response) {
                    // Navigate back to the website list page.
                    $location.url("/user/" + vm.userId + "/website");
                })
        }
    }
})();
// Website-new Controller
(function() {
    angular
        .module("WebAppMaker")
        .controller("websiteNewController", websiteNewController);


    function websiteNewController($routeParams, $location, WebsiteService) {
        var vm = this;

        function init() {
            vm.userId = $routeParams['uid'];
            WebsiteService
                .findWebsitesByUser(vm.userId)
                .then(function(websites) {
                    vm.websites = websites;
                })
        }
        init();
        // Event Handlers.
        vm.createWebsite = createWebsite;

        function createWebsite(name, description) {
            vm.nameError = null;
            vm.descriptionError = null;

            if (typeof name === 'undefined') {
                vm.nameError = "Please enter a website name."
                return;
            }
            if (typeof description === 'undefined') {
                vm.nameError = "Please enter a website description."
                return;
            }

            var website = {
                name: name,
                description: description
            };
            WebsiteService
                .createWebsite(vm.userId, website)
                .then(function(response) {
                    // Navigate back to the website list page.
                    $location.url("/user/" + vm.userId + "/website");
                })
        }
    }
})();
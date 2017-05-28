// Website-new Controller
(function() {
    angular
        .module("WebAppMaker")
        .controller("websiteNewController", websiteNewController);


    function websiteNewController($routeParams, $location, WebsiteService) {
        var vm = this;

        function init() {
            vm.userId = $routeParams['uid'];
            vm.websites = WebsiteService.findWebsitesByUser(vm.userId);
        }
        init();
        // Event Handlers.
        vm.createWebsite = createWebsite;

        function createWebsite(name, description) {
            vm.nameError = null
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
                description: description,
                developerId: vm.userId
            };
            WebsiteService.createWebsite(vm.userId, website);

            // Navigate back to the website list page.
            $location.url("/user/" + vm.userId + "/website");
        }
    };
})();
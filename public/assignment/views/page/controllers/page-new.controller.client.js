/**
 * Page-New Controller
 * Author: Matthew Murphy
  */
(function() {
    angular
        .module("WebAppMaker")
        .controller("pageNewController", pageNewController);


    function pageNewController($routeParams, $location, PageService) {
        var vm = this;

        function init() {
            vm.userId = $routeParams['uid'];
            vm.websiteId = $routeParams['wid'];
            PageService
                .findPagesByWebsiteId(vm.websiteId)
                .then(function(pages) {
                    vm.pages = pages;
                })
        }
        init();
        // Event Handlers.
        vm.createPage = createPage;

        function createPage(name, title) {
            vm.nameError = null
            vm.descriptionError = null;

            if (typeof name === 'undefined') {
                vm.nameError = "Please enter a page name."
                return;
            }
            if (typeof title === 'undefined') {
                vm.nameError = "Please enter a page title."
                return;
            }

            var page = {
                name: name,
                description: title
            };

            PageService
                .createPage(vm.websiteId, page)
                .then(function(response) {
                    // Navigate back to the page list page.
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                })

        }
    };
})();
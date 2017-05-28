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
            vm.pages = PageService.findPagesByWebsiteId(vm.websiteId);
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
                websiteId: vm.websiteId,
                description: title
            };
            PageService.createPage(vm.pageId, page);

            // Navigate back to the page list page.
            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
        }
    };
})();
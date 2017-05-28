// Page-Edit Controller
(function() {
    angular
        .module("WebAppMaker")
        .controller("pageEditController", pageEditController);


    function pageEditController($routeParams, $location, PageService) {
        var vm = this;

        function init() {
            vm.userId = $routeParams['uid'];
            vm.websiteId = $routeParams['wid'];
            vm.pageId = $routeParams['pid'];
            vm.pages = PageService.findPagesByWebsiteId(vm.websiteId);
            vm.page = PageService.findPageById(vm.pageId);
        }
        init();

        vm.editablePage = angular.copy(vm.page);

        // Event Handlers.
        vm.deletePage = deletePage;
        vm.updatePage = updatePage;

        function deletePage() {
            PageService.deletePage(vm.pageId);

            // Navigate back to the page list page.
            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
        }

        function updatePage() {
            vm.nameError = null;
            vm.descriptionError = null;

            if (typeof vm.editablePage.name === 'undefined') {
                vm.nameError = "Please enter a page name."
                return;
            }
            if (typeof vm.editablePage.description === 'undefined') {
                vm.nameError = "Please enter a page description."
                return;
            }

            var page = {
                name: vm.editablePage.name,
                description: vm.editablePage.description,
                websiteId: vm.websiteId
            };
            PageService.updatePage(vm.pageId, page);
            // Navigate back to the page list page.
            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
        }
    }
})();
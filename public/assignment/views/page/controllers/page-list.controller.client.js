// Website-list Controller
(function() {
    angular
        .module("WebAppMaker")
        .controller("pageListController", pageListController);


    function pageListController($routeParams, PageService) {
        var vm = this;

        function init() {
            vm.userId = $routeParams['uid'];
            vm.websiteId = $routeParams['wid'];
            vm.pages = PageService.findPagesByWebsiteId(vm.websiteId);
        }
        init();
    };
})();
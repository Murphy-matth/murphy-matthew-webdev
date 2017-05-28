// Website-list Controller
(function() {
    angular
        .module("WebAppMaker")
        .controller("websiteListController", websiteListController);


    function websiteListController($routeParams, WebsiteService) {
        var vm = this;

        function init() {
            vm.userId = $routeParams['uid'];
            vm.websites = WebsiteService.findWebsitesByUser(vm.userId);
        }
        init();
        // Event Handlers.
    };
})();
// Website-list Controller
(function() {
    angular
        .module("WebAppMaker")
        .controller("websiteListController", websiteListController);


    function websiteListController($routeParams, WebsiteService) {
        var vm = this;

        function init() {
            vm.userId = $routeParams['uid'];
            WebsiteService.findWebsitesByUser(vm.userId)
                .then(function(websites) {
                    vm.websites = websites;
                })
        }
        init();
        // Event Handlers.
    }
})();
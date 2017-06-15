// Website-list Controller
(function() {
    'use strict';

    angular
        .module("WebAppMaker")
        .controller("pageListController", pageListController);


    function pageListController($routeParams, PageService) {
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
    }
})();
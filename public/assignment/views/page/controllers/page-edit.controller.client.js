// Page-Edit Controller
(function() {
    'use strict';

    angular
        .module("WebAppMaker")
        .controller("pageEditController", pageEditController);


    function pageEditController($routeParams, $location, PageService) {
        var vm = this;

        function init() {
            vm.userId = $routeParams['uid'];
            vm.websiteId = $routeParams['wid'];
            vm.pageId = $routeParams['pid'];

            PageService
                .findPagesByWebsiteId(vm.websiteId)
                .then(function(pages) {
                   vm.pages = pages;
                });
            PageService
                .findPageById(vm.pageId)
                .then(function(page) {
                    vm.page = page;
                    vm.editablePage = angular.copy(vm.page);
                })
        }
        init();

        // Event Handlers.
        vm.deletePage = deletePage;
        vm.updatePage = updatePage;

        function deletePage() {
            PageService
                .deletePage(vm.pageId)
                .then(function(response) {
                    // Navigate back to the page list page.
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                })
        }

        function updatePage() {
            vm.nameError = null;
            vm.descriptionError = null;

            if (typeof vm.editablePage.name === 'undefined') {
                vm.nameError = "Please enter a page name.";
                return;
            }
            if (typeof vm.editablePage.description === 'undefined') {
                vm.descriptionError = "Please enter a page description.";
                return;
            }

            var page = {
                name: vm.editablePage.name,
                description: vm.editablePage.description,
                websiteId: vm.websiteId
            };

            PageService
                .updatePage(vm.pageId, page)
                .then(function(response) {
                    // Navigate back to the page list page.
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                })
        }
    }
})();
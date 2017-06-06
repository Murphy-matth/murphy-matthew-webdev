/**
 * Search Controller
 * Controller for the main search page
 * Author: Matthew Murphy
  */
(function() {
    angular
        .module("KnowYourRep")
        .controller("searchHomeController", searchHomeController);


    function searchHomeController($location, $routeParams) {
        var vm = this;

        function init() {
            vm.chamber = 'Senate';
            var message = $routeParams['message'];
            if (message !== null) {
                if (message === 'id') {
                    vm.showLink = true;
                } else if (message === 'state') {
                    vm.warningMessage = 'Please enter a valid two letter state abbreviation';
                }
            }
        }
        init();

        vm.updateDropDown = updateDropDown;
        vm.search = search;

        function search(searchText) {
            resetMessages();
            if (searchText === null || searchText.length === 0) {
                $location.url('/search/' + vm.chamber.toLowerCase() + '/query/');
            } else {
                $location.url('/search/' + vm.chamber.toLowerCase() + '/query/' + searchText.toUpperCase());
            }
        }

        // Updates the chamber to the given text.
        function updateDropDown(text) {
            vm.chamber = text;
        }

        function resetMessages() {
            vm.warningMessage = null;
            vm.showLink = null;
        }
    }
})();

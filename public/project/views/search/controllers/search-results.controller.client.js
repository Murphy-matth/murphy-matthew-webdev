/**
 * Search Results Controller
 * Controller for displaying the search results
 * Author: Matthew Murphy
 */
(function() {
    angular
        .module("KnowYourRep")
        .controller("searchResultsController", searchResultsController);


    function searchResultsController($routeParams, $location, $window, proPublicaService, imageService, feedService) {
        var vm = this;

        vm.tabs = [
            'About',
            'Contact',
            'RSS'
        ];

        function init() {
            vm.chamber = $routeParams['cid'];
            var query = $routeParams['query'];

            // The default tab is the about tab
            currentTabUrl = 'views/search/templates/tabs/about.tab.view.client.html';
            vm.currentTab = 'about';

            // RSS Feeds
            vm.feeds = [];
            vm.show = false;

            vm.reps = [];
            vm.selectedReps = [];

            if (query === null) {
                findAllRepresentatives();
            } else if (query.length === 2) {
                preformStateSearch(query);
            } else {
                preformIdSearch(query);
            }
        }
        init();

        vm.getResultsPageBody = getResultsPageBody;
        vm.getCurrentTabUrl = getCurrentTabUrl;
        vm.setTab = setTab;
        vm.isCurrentTab = isCurrentTab;
        vm.selectRep = selectRep;
        vm.reset = reset;
        vm.openUrl = openUrl;
        vm.showMore = showMore;
        vm.showLess = showLess;

        function showMore() {
            vm.show = true;
        }

        function showLess() {
            vm.show = false;
        }

        // Open the given url in a new window. Needed to bypass ng-route catching the ng-href attributes.
        function openUrl(url) {
            $window.open(url, '_blank');
        }

        // Resets the currently selected representative back to the original search query.
        function reset() {
            vm.selectedReps = vm.reps;
        }

        // Selects the representative to show more details whose id matches the id field
        function selectRep(id) {
            proPublicaService
                .findRepresentativeById(id, vm.chamber.toLowerCase())
                .then(function(rep) {
                    if (rep === 'ERRROR') {
                        $location.url('/search/id')
                    } else {
                        processRep(rep[0]);
                        vm.selectedReps = [];
                        vm.selectedReps.push(rep[0]);
                        console.log(rep[0]);
                    }
                })
        }

        // Returns the url of the current profile tab.
        function getCurrentTabUrl() {
            return currentTabUrl;
        }

        // Sets the current tab.
        function setTab(tab) {
            vm.currentTab = tab.toLowerCase();
            if (tab === 'RSS') {
                if (vm.feeds.length === 0) {
                    loadFeed();
                }
            }
            currentTabUrl = 'views/search/templates/tabs/' + tab.toLowerCase() + '.tab.view.client.html';
        }

        function loadFeed() {
            feedService
                .parseFeed(vm.selectedReps[0].rss_url)
                .then(function (res) {
                    vm.feeds = res;
                });
        }

        // Returns true if the tab is the currently active tab.
        function isCurrentTab(tab) {
            return tab.toLowerCase() === vm.currentTab;
        }

        function getResultsPageBody() {
            if (vm.selectedReps.length > 1) {
                return 'views/search/templates/multi-result.view.client.html';
            } else {
                return 'views/search/templates/single-result.view.client.html';
            }
        }

        function processReps() {
            for (var ii = 0; ii < vm.reps.length; ii++) {
                (function() {
                    processRep(vm.reps[ii]);
                })();
            }
        }

        function processRep(rep) {
            getImageSrc(rep.id)
                .then(function(url) {
                    rep.photo = url;
                })
        }

        function getImageSrc(id) {
            return imageService
                .findImageById(id)
                .then(function(response) {
                    return response;
                })
        }


        function preformIdSearch(id) {
            resetMessages();
            proPublicaService
                .findRepresentativeById(id, vm.chamber.toUpperCase())
                .then(function(rep) {
                    if (rep === 'ERRROR') {
                        $location.url('/search/id')
                    } else {
                        vm.reps = rep;
                        processReps();
                        vm.selectedReps = vm.reps;
                    }
                })
        }

        function findAllRepresentatives() {
            resetMessages();
            proPublicaService
                .findAllRepresentatives(vm.chamber.toUpperCase())
                .then(function(data) {
                    console.log(data);
                    vm.reps = data;
                    processReps();
                    vm.selectedReps = vm.reps;
                })
        }

        // Look up a given states representatives for either the house or the senate.
        function preformStateSearch(state) {
            proPublicaService
                .findRepresentativeByState(state.toUpperCase(), vm.chamber.toLowerCase())
                .then(function(rep) {
                    if (rep === 'ERROR') {
                        $location.url('/search/state')
                    } else {
                        console.log(rep);
                        vm.reps = rep;
                        processReps();
                        vm.selectedReps = vm.reps;
                    }
                })
        }
    }
})();

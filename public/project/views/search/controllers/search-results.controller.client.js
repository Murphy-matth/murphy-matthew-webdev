/**
 * Search Results Controller
 * Controller for displaying the search results
 * Author: Matthew Murphy
 */
(function() {
    "use strict";

    angular
        .module("KnowYourRep")
        .controller("searchResultsController", searchResultsController);


    function searchResultsController($routeParams, $location, userService, proPublicaService, imageService, feedService, repService) {
        var vm = this;

        /**
         * Search results tab's for the in depth view.
         * @type {[*]}
         */
        vm.tabs = [
            'About',
            'Contact',
            'RSS'
        ];


        function init() {
            vm.chamber = $routeParams['cid'];
            var query = $routeParams['query'];

            // The default tab is the about tab
            vm.currentTabUrl = 'views/search/templates/tabs/about.tab.view.client.html';
            vm.currentTab = 'about';

            // RSS Feeds
            vm.feeds = [];
            vm.show = false;

            vm.reps = [];
            vm.selectedReps = [];

            resetMessages();

            checkedLoggedIn(function () {
                vm.loggedIn = true;
            }, function () {
                vm.loggedIn = false;
            });

            if (query === null || typeof query === 'undefined') {
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
        vm.showMore = showMore;
        vm.showLess = showLess;
        vm.followRep = followRep;
        vm.goToProfile = goToProfile;

        function checkedLoggedIn(success, failure) {
            userService
                .checkLoggedIn()
                .then(function (currentUser) {
                    if(currentUser === '0') {
                        vm.loggedIn = false;
                        failure();
                    } else {
                        vm.loggedIn = true;
                        success();
                    }
                });
        }

        function resetMessages() {
            vm.followSuccess = false;
        }

        function goToProfile() {
            if (vm.loggedIn === null) {
                checkedLoggedIn(success, failure);
            } else {
                if (vm.loggedIn) {
                    success();
                } else {
                    failure();
                }
            }

            function success() {
                $location.url('/user');
            }
            function failure() {
                console.log("You need to log in");
                $location.url('/login');
            }
        }

        function followRep(rep) {
            resetMessages();
            rep.chamber = vm.chamber;
            if (vm.loggedIn === null) {
                checkedLoggedIn(success, failure);
            } else {
                if (vm.loggedIn) {
                    success();
                } else {
                    failure();
                }
            }

            function success() {
                repService
                    .createRep(rep)
                    .then(function (response) {
                        vm.followSuccess = rep.id || rep.member_id;
                    }, function (err) {
                    })
            }
            function failure() {
                console.log("You need to log in");
                $location.url('/login');
            }
        }

        function showMore() {
            vm.show = true;
        }

        function showLess() {
            vm.show = false;
        }

        // Resets the currently selected representative back to the original search query.
        function reset() {
            vm.selectedReps = vm.reps;
        }

        // Selects the representative to show more details whose id matches the id field
        function selectRep(id) {
            vm.newRep = true;
            proPublicaService
                .findRepresentativeById(id, vm.chamber.toLowerCase())
                .then(function(rep) {
                    if (rep === 'ERROR' || typeof rep === 'undefined') {
                        $location.url('/search/id')
                    } else {
                        processRep(rep[0]);
                        vm.selectedReps = [];
                        vm.selectedReps.push(rep[0]);
                    }
                })
        }

        // Returns the url of the current profile tab.
        function getCurrentTabUrl() {
            return vm.currentTabUrl;
        }

        // Sets the current tab.
        function setTab(tab) {
            vm.currentTab = tab.toLowerCase();
            if (tab === 'RSS') {
                if (vm.newRep || vm.feeds.length === 0) {
                    loadFeed();
                    vm.newRep = false;
                }
            }
            vm.currentTabUrl = 'views/search/templates/tabs/' + tab.toLowerCase() + '.tab.view.client.html';
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
            getImageSrc(rep.id || rep.member_id)
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
                    if (rep === 'ERROR' || typeof rep === 'undefined') {
                        $location.url('/search/id');
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
                    vm.reps = data[0].members;
                    processReps();
                    vm.selectedReps = vm.reps;
                })
        }

        // Look up a given states representatives for either the house or the senate.
        function preformStateSearch(state) {
            resetMessages();
            proPublicaService
                .findRepresentativeByState(state.toUpperCase(), vm.chamber.toLowerCase())
                .then(function(rep) {
                    if (rep === 'ERROR' || typeof rep === 'undefined') {
                        $location.url('/search/state')
                    } else {
                        vm.reps = rep;
                        processReps();
                        vm.selectedReps = vm.reps;
                    }
                })
        }
    }
})();

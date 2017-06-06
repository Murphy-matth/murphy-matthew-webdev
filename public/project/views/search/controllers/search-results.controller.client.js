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
            vm.feeds = null;

            vm.reps = [{
                "id": "A000360",
                "api_uri":"https://api.propublica.org/congress/v1/members/A000360.json",
                "first_name": "Lamar",
                "middle_name": "",
                "last_name": "Alexander",
                "party": "R",
                "leadership_role": "",
                "twitter_account": "SenAlexander",
                "facebook_account": "senatorlamaralexander",
                "govtrack_id": "300002",
                "cspan_id": "5",
                "votesmart_id": "",
                "icpsr_id": "40304",
                "crp_id": "",
                "google_entity_id": "/m/01rbs3",
                "url": "https://www.alexander.senate.gov/public/index.cfm/home",
                "rss_url": "http://www.alexander.senate.gov/public/?a=RSS.Feed",
                "domain": "",
                "in_office": "true",
                "dw_nominate": "",
                "ideal_point": "",
                "seniority": "15",
                "next_election": "2020",
                "total_votes": "82",
                "missed_votes": "1",
                "total_present": "0",
                "ocd_id": "ocd-division/country:us/state:tn",
                "office": "",
                "phone": "202-224-4944",
                "state": "TN",
                "senate_class": "2",
                "state_rank": "",
                "lis_id": "S289"
                ,"missed_votes_pct": "1.22",
                "votes_with_party_pct": "98.77"
            },
                {
                    "id": "B000575",
                    "api_uri":"https://api.propublica.org/congress/v1/members/B000575.json",
                    "first_name": "Roy",
                    "middle_name": "",
                    "last_name": "Blunt",
                    "party": "R",
                    "leadership_role": "",
                    "twitter_account": "RoyBlunt",
                    "facebook_account": "SenatorBlunt",
                    "govtrack_id": "400034",
                    "cspan_id": "45465",
                    "votesmart_id": "",
                    "icpsr_id": "29735",
                    "crp_id": "",
                    "google_entity_id": "/m/034fn4",
                    "url": "http://www.blunt.senate.gov/public",
                    "rss_url": "http://www.blunt.senate.gov/public/?a=RSS.Feed",
                    "domain": "",
                    "in_office": "true",
                    "dw_nominate": "",
                    "ideal_point": "",
                    "seniority": "7",
                    "next_election": "2022",
                    "total_votes": "82",
                    "missed_votes": "2",
                    "total_present": "0",
                    "ocd_id": "ocd-division/country:us/state:mo",
                    "office": "",
                    "phone": "202-224-5721",
                    "state": "MO",
                    "senate_class": "3",
                    "state_rank": "",
                    "lis_id": "S342"
                    ,"missed_votes_pct": "2.44",
                    "votes_with_party_pct": "98.75"
                }];
            processReps();
            vm.selectedReps = vm.reps;
            if (query === null) {
                // findAllRepresentatives();
            } else if (query.length === 2) {
                // preformStateSearch(query);
            } else {
                // preformIdSearch(query);
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
            vm.selectedReps = vm.reps.filter(function(rep) {
                return rep.id === id;
            });
        }

        // Returns the url of the current profile tab.
        function getCurrentTabUrl() {
            return currentTabUrl;
        }

        // Sets the current tab.
        function setTab(tab) {
            vm.currentTab = tab.toLowerCase();
            if (tab === 'RSS') {
                // loadFeed();
            }
            currentTabUrl = 'views/search/templates/tabs/' + tab.toLowerCase() + '.tab.view.client.html';
        }

        function loadFeed() {
            feedService
                .parseFeed(vm.selectedReps[0].rss_url)
                .then(function (res) {
                    vm.feeds = res.data.responseData.feed.entries;
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
                    var temp = ii;
                    getImageSrc(vm.reps[temp].id)
                        .then(function(url) {
                            vm.reps[temp].photo = url;
                        })
                })();
            }
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
                        console.log(data);
                    }
                })
        }

        function findAllRepresentatives() {
            resetMessages();
            proPublicaService
                .findAllRepresentatives(vm.chamber.toUpperCase())
                .then(function(data) {
                    console.log(data);
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
                    }
                })
        }
    }
})();

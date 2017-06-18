// Routing files for the angular application.
(function() {
    "use strict";

    angular.module("KnowYourRep")
        .config(Config);

    function Config($routeProvider) {
        // User pages.
        $routeProvider
            .when("/login", {
                templateUrl: "views/user/templates/login.view.client.html",
                controller: "loginController",
                controllerAs: 'vm'
            })
            .when("/", {
                templateUrl: "views/search/templates/search.view.client.html",
                controller: 'searchHomeController',
                controllerAs: 'vm'
            })
            .when("/register", {
                templateUrl: "views/user/templates/register.view.client.html",
                controller: "registerController",
                controllerAs: 'vm'
            })
            .when("/user", {
                templateUrl: "views/user/templates/profile.view.client.html",
                controller: "profileController",
                controllerAs: 'vm',
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when("/user/:uid", {
                templateUrl: "views/user/templates/profile.view.client.html",
                controller: "profileController",
                controllerAs: 'vm',
                resolve: {
                    currentUser: checkLoggedIn
                }
            });

        // Search Pages.
        $routeProvider
            .when("/search", {
                templateUrl: "views/search/templates/search.view.client.html",
                controller: 'searchHomeController',
                controllerAs: 'vm'
            })
            .when("/search/:message", {
                templateUrl: "views/search/templates/search.view.client.html",
                controller: 'searchHomeController',
                controllerAs: 'vm'
            })
            .when("/search/:cid/query/:query", {
                templateUrl: "views/search/templates/search-results.view.client.html",
                controller: 'searchResultsController',
                controllerAs: 'vm'
            });

        function checkAdmin($q, $location, userService) {
            var deferred = $q.defer();
            userService
                .checkAdmin()
                .then(function (currentUser) {
                    if(currentUser === '0') {
                        deferred.resolve({});
                        $location.url('/');
                    } else {
                        deferred.resolve(currentUser);
                    }
                });
            return deferred.promise;
        }

        function checkLoggedIn($q, $location, userService) {
            var deferred = $q.defer();
            userService
                .checkLoggedIn()
                .then(function (currentUser) {
                    if(currentUser === '0') {
                        deferred.reject();
                        $location.url('/login');
                    } else {
                        deferred.resolve(currentUser);
                    }
                });
            return deferred.promise;
        }
    }
})();
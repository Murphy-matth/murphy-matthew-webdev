// Routing files for the angular application.
(function() {
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
                templateUrl: "views/user/templates/login.view.client.html",
                controller: "loginController",
                controllerAs: 'vm'
            })
            .when("/register", {
                templateUrl: "views/user/templates/register.view.client.html",
                controller: "registerController",
                controllerAs: 'vm'
            })
            .when("/user/:uid", {
                templateUrl: "views/user/templates/profile.view.client.html",
                controller: "profileController",
                controllerAs: 'vm'
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
    }
})();
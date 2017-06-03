// Routing files for the angular application.
(function() {
    angular.module("PokerHandReplayer")
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
    }
})();
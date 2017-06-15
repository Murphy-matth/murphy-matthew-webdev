// Routing files for the angular application.
(function() {
    angular.module("WebAppMaker")
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

        // Website pages.
        $routeProvider
            .when("/user/:uid/website", {
                templateUrl: "views/website/templates/website-list.view.client.html",
                controller: "websiteListController",
                controllerAs: 'vm'
            })
            .when("/user/:uid/website/new", {
                templateUrl: "views/website/templates/website-new.view.client.html",
                controller: "websiteNewController",
                controllerAs: 'vm'
            })
            .when("/user/:uid/website/:wid", {
                templateUrl: "views/website/templates/website-edit.view.client.html",
                controller: "websiteEditController",
                controllerAs: 'vm'
            });

        // Page pages.
        $routeProvider
            .when("/user/:uid/website/:wid/page", {
                templateUrl: "views/page/templates/page-list.view.client.html",
                controller: "pageListController",
                controllerAs: 'vm'
            })
            .when("/user/:uid/website/:wid/page/new", {
                templateUrl: "views/page/templates/page-new.view.client.html",
                controller: "pageNewController",
                controllerAs: 'vm'
            })
            .when("/user/:uid/website/:wid/page/:pid", {
                templateUrl: "views/page/templates/page-edit.view.client.html",
                controller: "pageEditController",
                controllerAs: 'vm'
            });

        // Widget pages.
        $routeProvider
            .when("/user/:uid/website/:wid/page/:pid/widget", {
                templateUrl: "views/widget/templates/widget-list.view.client.html",
                controller: "widgetListController",
                controllerAs: 'vm'
            })
            .when("/user/:uid/website/:wid/page/:pid/widget/new", {
                templateUrl: "views/widget/templates/widget-chooser.view.client.html",
                controller: "widgetChooseController",
                controllerAs: 'vm'
            })
            .when("/user/:uid/website/:wid/page/:pid/widget/:wigid", {
                templateUrl: "views/widget/templates/widget-edit.view.client.html",
                controller: "widgetEditController",
                controllerAs: 'vm'
            })
            .when('/user/:uid/website/:wid/page/:pid/widget/:wigid/search', {
                templateUrl: 'views/widget/templates/widgets/widget-flickr-search.view.client.html',
                controller: 'flickrController',
                controllerAs: 'vm'
            });

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
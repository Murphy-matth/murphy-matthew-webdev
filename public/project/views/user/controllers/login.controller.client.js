/**
 * Login Controller
 * Author: Matthew Murphy
 */
(function() {
    "use strict";

    angular
        .module("KnowYourRep")
        .controller("loginController", loginController);


        function loginController($scope, $location, userService) {
            var vm = this;

            vm.login = function (username, password) {
                vm.invalid = null;

                if ($scope.loginForm.$invalid) {
                    return;
                }

                userService
                    .login(username, password)
                    .then(function(user) {
                        if (!user) {
                            vm.invalid = "Invalid username or password. Please try again";
                            return;
                        }
                        $location.url('/user');
                    }, function (err) {
                        vm.invalid = "Invalid username or password. Please try again";
                    });
            };
        }
})();

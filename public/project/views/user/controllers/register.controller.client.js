// Register Controller
(function() {
    "use strict";

    angular
        .module("KnowYourRep")
        .controller("registerController", registerController);

    function registerController($scope, $location, userService, passwordService) {
        var vm = this;

        vm.register = register;

        function register(username, password, verify) {
            // Reset all of the messages
            vm.passwordWarning = null;

            if ($scope.registerForm.$invalid) {
                return;
            }

            if (password !== verify) {
                vm.passwordWarning = "Passwords do not match. Please verify that they are the same.";
                return;
            }

            var valid = passwordService.validate(password);
            if (!valid.result) {
                vm.passwordWarning = valid.message;
                return;
            }

            var user = {
                username: username,
                password: password
            };

            userService
                .register(user)
                .then(function (user) {
                    if (!user) {
                        return;
                    }
                    $location.url("/user/" + user._id);
                }, function (err) {
                    console.log(err);
                })
        }
    }
})();

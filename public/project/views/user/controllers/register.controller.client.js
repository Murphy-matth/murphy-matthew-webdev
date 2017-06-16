// Register Controller
(function() {
    "use strict";

    angular
        .module("KnowYourRep")
        .controller("registerController", registerController);

    function registerController($location, userService, passwordService) {
        var vm = this;

        vm.register = register;

        function register(username, password, verify) {
            // Reset all of the messages
            vm.registerError = null;
            vm.invalidUsername = false;
            vm.invalidPassword = false;
            vm.passwordWarning = null;

            if (typeof username === 'undefined') {
                vm.invalidUsername = true;
                vm.registerError = "Please enter a username";
                return;
            }

            if (typeof password === 'undefined' || typeof verify === 'undefined') {
                vm.invalidPassword = true;
                vm.registerError = "Please enter and verify your password";
                return;
            }

            var valid = passwordService.validate(password);
            if (!valid.result) {
                vm.passwordWarning = valid.message;
                vm.invalidPassword = true;
                return;
            }

            if (password !== verify) {
                vm.passwordWarning = "Passwords do not match. Please verify that they are the same.";
                vm.invalidPassword = true;
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

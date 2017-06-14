// Login Controller
(function() {
    "use strict";

    angular
        .module("KnowYourRep")
        .controller("loginController", loginController);


        function loginController($location, userService) {
            var vm = this;

            vm.login = function (username, password) {
                vm.invalidUsername = null;
                vm.invalidPassword = null;

                if (typeof username === 'undefined') {
                    vm.invalidUsername = "Please enter a username.";
                    return;
                }

                // Check if the username exists.
                userService
                    .findUserByUsername(username)
                    .then(userExists, userDoesNotExist);

                // If the username exists then attempt to log in with the password.
                function userExists(response) {
                    userService
                        .findUserByCredentials(username, password)
                        .then(handleLogin, handleLoginError);
                }

                // If the username does not exist present an error message.
                function userDoesNotExist(error) {
                    // Username is invalid.
                    vm.invalidUsername = "Username not found. Please try again :)";
                }

                // Handle the login response.
                function handleLogin(user) {
                    $location.url("/user/" + user._id);
                }

                // If there is a login error present an error message.
                function handleLoginError(error) {
                    vm.invalidPassword = "Invalid password. Please try again";
                }
            }
        }
})();

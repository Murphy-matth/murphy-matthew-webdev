// Register Controller
(function() {
    angular
        .module("WebAppMaker")
        .controller("registerController", registerController);

    function registerController($location, userService) {
        var vm = this;

        vm.register = register;
        vm.update = update;

        function update(username, password, email, firstName, lastName) {
            vm.updateError = null;

            userService
                .findUserByCredentials(username, password)
                .then(userFound, userNotFound);

            function userNotFound(error) {
                vm.updateError = "You are not allowed to update the username or password";

            }

            function userFound(user) {
                var newUser = angular.copy(user);
                newUser.email = email;
                newUser.firstName = firstName;
                newUser.lastName = lastName;

                // Do not need to handle the response.
                userService.updateUser(newUser._id, newUser);
            }
        }

        function register(username, password, verify) {
            vm.registerError = null;

            if (password !== verify) {
                vm.registerError = "Passwords do not match. Please verify that they are the same.";
                return;
            }

            userService
                .findUserByUsername(username)
                .then(userExists, userDoesNotExist);

            function userExists(reponse) {
                vm.registerError = "Username is already in use. Please use another name.";
            }

            function userDoesNotExist(error) {
                // Make the user.
                user = {
                    username: username,
                    password: password,
                    email: "www.example.com",
                    firstName: "",
                    lastName: ""
                };
                // Add it to the service.
                userService
                    .createUser(user)
                    .then(onRegistered, onRegisteredError);

                function onRegistered(user) {
                    // Load the login page.
                    $location.url("/user/" + user._id);
                }

                function onRegisteredError(error) {
                    console.log(error);
                }
            }
        }
    };
})();

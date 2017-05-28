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

            var user = userService.findUserByCredentials(username, password);
            if (user === undefined) {
                vm.updateError = "You are not allowed to update the username or password";
                return;
            }

            var newUser = angular.copy(user);
            newUser.email = email;
            newUser.firstName = firstName;
            newUser.lastName = lastName;

            userService.updateUser(newUser._id, newUser);
        }

        function register(username, password, verify) {
            vm.registerError = null;

            if (password !== verify) {
                vm.registerError = "Passwords do not match. Please verify that they are the same.";
                return;
            }

            var taken = userService.findUserByUsername(username);
            if (taken === null) {
                // Make the user.
                user = {
                    username: username,
                    password: password
                };
                // Add it to the service.
                var user = userService.createUser(user);
                // Load the login page.
                $location.url("/user/" + user._id);
            } else {
                vm.registerError = "Username is already in use. Please use another name.";
            }
        }
    };
})();

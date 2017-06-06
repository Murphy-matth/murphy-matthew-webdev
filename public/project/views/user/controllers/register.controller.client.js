// Register Controller
(function() {
    angular
        .module("KnowYourRep")
        .controller("registerController", registerController);

    function registerController($location, userService, passwordService) {
        var vm = this;

        vm.register = register;

        function register(username, password, verify) {
            vm.passwordError = null;
            vm.usernameTaken = null;

            var valid = passwordService.validate(password);
            if (!valid.result) {
                vm.passwordWarning = valid.message;
                return;
            }

            if (password !== verify) {
                vm.passwordError = "Passwords do not match. Please verify that they are the same.";
                return;
            }

            userService
                .findUserByUsername(username)
                .then(userExists, userDoesNotExist);

            function userExists(reponse) {
                vm.registerError = "Username is already in use.";
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

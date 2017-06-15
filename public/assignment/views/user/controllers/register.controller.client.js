// Register Controller
(function() {
    angular
        .module("WebAppMaker")
        .controller("registerController", registerController);

    function registerController($location, userService) {
        var vm = this;

        vm.register = register;

        function register(username, password, verify) {
            // Reset all of the messages
            vm.registerError = null;
            vm.invalidUsername = false;
            vm.invalidPassword = false;

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

            if (password !== verify) {
                vm.registerError = "Passwords do not match. Please verify that they are the same.";
                vm.invalidPassword = true;
                return;
            }

            var user = {
                username: username,
                password: password,
                email: "www.example.com",
                firstName: "",
                lastName: ""
            };

            userService
                .register(user)
                .then(function (user) {
                    $location.url("/user/"+ user._id);
                })
        }
    }
})();

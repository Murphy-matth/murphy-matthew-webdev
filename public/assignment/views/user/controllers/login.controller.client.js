// Login Controller
(function() {
    angular
        .module("WebAppMaker")
        .controller("loginController", loginController);


        function loginController($location, userService) {
            var vm = this;

            vm.login = function (username, password) {
                vm.invalidUsername = null;
                vm.invalidPassword = null;

                if (typeof username === 'undefined') {
                    vm.invalidUsername = "Please enter a username."
                    return;
                }

                var validUser = userService.findUserByUsername(username);
                if (validUser === null) {
                    // Username is invalid.
                    vm.invalidUsername = "Username " + username + " not found. Please try again";
                    return;
                }

                var found = userService.findUserByCredentials(username, password);
                if (found !== null) {
                    $location.url("/user/" + found._id + "/website");
                } else {
                    vm.invalidPassword = "Invalid password. Please try again";
                }
            }
        };
})();

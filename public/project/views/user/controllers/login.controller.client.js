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
                if (typeof password === 'undefined') {
                    vm.invalidPassword = "Please enter a password.";
                    return;
                }

                userService
                    .login(username, password)
                    .then(function(user) {
                        if (!user) {
                            vm.invalidPassword = "Invalid username or password. Please try again";
                            return;
                        }
                        $location.url("/user/" + user._id);
                    }, function (err) {
                        vm.invalidPassword = "Invalid username or password. Please try again";
                    });
            };
        }
})();

// Profile Controller
(function() {
    angular
        .module("WebAppMaker")
        .controller("profileController", profileController);

        function profileController($routeParams, userService) {
            var vm = this;

            function init() {
                vm.userId = $routeParams['uid'];
                vm.savedUser = userService.findUserById(vm.userId);
            }
            init();

            vm.user = angular.copy(vm.savedUser);

            vm.update = update;

            // Updates the current user with the new values in the profile.
            function update() {
                userService.updateUser(vm.userId, vm.user);
                vm.message = "Update Successful!";
            }
        };
})();

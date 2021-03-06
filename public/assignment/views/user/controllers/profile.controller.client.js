// Profile Controller
(function() {
    angular
        .module("WebAppMaker")
        .controller("profileController", profileController);

        function profileController($routeParams, $location, userService) {
            var vm = this;

            function init() {
                vm.userId = $routeParams['uid'];
                if (vm.userId) {
                    userService
                        .findUserById(vm.userId)
                        .then(handleLoad, handleLoadError);
                } else {
                    userService
                        .findCurrentUser()
                        .then(handleLoad, handleLoadError);
                }
            }
            init();

            vm.logout = function() {
                userService
                    .logout()
                    .then(function () {
                        $location.url('/login');
                    });
            };

            vm.update = function () {
                userService
                    .updateUser(vm.userId, vm.user)
                    .then(handleUpdate, handleUpdateError);
            };

            // Handles the response returned by the userService when updating a user.
            function handleUpdate(response) {
                vm.message = "Update Successful!";
            }

            // Handles errors related to updating the userService.
            function handleUpdateError(error) {
                console.log(error);
            }

            // Loads the current user for use by the models.
            function handleLoad(user) {
                console.log(user);
                vm.savedUser = user;
                vm.userId = user._id;
                vm.user = angular.copy(vm.savedUser);
            }

            // Handles errors related to loading users.
            function handleLoadError(error) {
                console.log(error);
            }
        }
})();

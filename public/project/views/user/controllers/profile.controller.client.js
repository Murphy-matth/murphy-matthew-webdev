// Profile Controller
(function() {
    angular
        .module("PokerHandReplayer")
        .controller("profileController", profileController);

        function profileController($routeParams, $filter, userService, passwordService) {
            var vm = this;

            vm.tabs = [
                'About',
                'Stats',
                'Messages',
                'Following',
                'Edit',
                'Account Settings'
            ];

            function init() {
                vm.userId = $routeParams['uid'];
                updateProfileInfo();
            }
            init();

            vm.user = angular.copy(vm.savedUser);
            vm.password = {
                old: "",
                new: "",
                verify: ""
            };

            // The default tab is the about tab
            currentTabUrl = 'views/user/templates/tabs/about.tab.view.client.html';
            vm.currentTab = 'about';

            vm.update = update;
            vm.getCurrentTabUrl = getCurrentTabUrl;
            vm.setTab = setTab;
            vm.isCurrentTab = isCurrentTab;
            vm.updatePassword = updatePassword;

            // Updates the user's password.
            function updatePassword() {
                // Clear all of the old error messages.
                vm.updatePasswordFailed = null;
                vm.updatePasswordSuccess = null;
                vm.invalidOldPassword = null;


                if (vm.password.new !== vm.password.verify) {
                    vm.updatePasswordFailed = "Passwords must match!"
                    return;
                }

                var result = userService.findUserByCredentials(vm.savedUser.username, vm.password.old);
                if (result === null) {
                    vm.invalidOldPassword = "Password incorrect";
                    return;
                }

                result = passwordService.validate(vm.password.new);
                if (!result.result) {
                    vm.updatePasswordFailed = result.message;
                    return;
                }

                result = userService.updatePassword(vm.userId, vm.password.new);
                vm.updatePasswordSuccess = result;
                vm.updatePasswordFailed = null;
            }

            // Updates the current user with the new values in the profile.
            function update() {
                userService
                    .updateUser(vm.userId, vm.user)
                    .then(updateSuccess, updateFailed);

                function updateSuccess(user) {
                    vm.message = "Update Successful!";
                    updateProfileInfo();
                }

                function updateFailed(error) {
                    console.log(error);
                }
            }

            // Returns the url of the current profile tab.
            function getCurrentTabUrl() {
                return currentTabUrl;
            }

            // Sets the current tab.
            function setTab(tab) {
                vm.currentTab = tab.toLowerCase();
                currentTabUrl = 'views/user/templates/tabs/' + tab.toLowerCase() + '.tab.view.client.html';
            }

            // Returns true if the tab is the currently active tab.
            function isCurrentTab(tab) {
                return tab.toLowerCase() === vm.currentTab;
            }

            // Updates the current profile information to reflect any changes.
            function updateProfileInfo() {
                userService
                    .findUserById(vm.userId)
                    .then(handleUpdate);

                // Handles the response from updating the user.
                function handleUpdate(user) {
                    vm.savedUser = user;

                    vm.profileInfo = [
                        {label : 'First Name:', value: vm.savedUser.firstName},
                        {label : 'Last Name:', value: vm.savedUser.lastName},
                        {label : 'Email:', value: vm.savedUser.email},
                        {label : 'Member Since:', value: $filter('date')(vm.savedUser.dateJoined)}
                    ];

                    vm.games = vm.savedUser.games;
                }
            }
        }
})();

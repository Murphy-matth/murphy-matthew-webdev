// Profile Controller
(function() {
    "use strict";

    angular
        .module("KnowYourRep")
        .controller("profileController", profileController);

        function profileController($routeParams, $filter, userService, passwordService, repService) {
            var vm = this;

            vm.tabs = [
                'About',
                'Following',
                'Followers',
                'Reps',
                'Edit',
                'Account Settings'
            ];

            vm.otherTabs = [
                'About',
                'Following',
                'Followers'
            ];

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

                function handleLoad(user) {
                    console.log(user);
                    vm.userId = user._id;
                    vm.otherUser = $routeParams['oid'];
                    updateProfileInfo();
                }

                function handleLoadError(err) {
                    console.log(err);
                }
            }
            init();

            vm.password = {
                old: "",
                new: "",
                verify: ""
            };

            // The default tab is the about tab
            var currentTabUrl = 'views/user/templates/tabs/about.tab.view.client.html';
            vm.currentTab = 'about';

            vm.update = update;
            vm.getCurrentTabUrl = getCurrentTabUrl;
            vm.setTab = setTab;
            vm.isCurrentTab = isCurrentTab;
            vm.updatePassword = updatePassword;
            vm.followUser = followUser;
            vm.removeFollowing = removeFollowing;
            vm.removeFollower = removeFollower;
            vm.deleteRep = deleteRep;

            function deleteRep(userId, repId) {
                repService
                    .deleteRep(userId, repId)
                    .then(function (response) {
                        console.log("Success. Removed the rep");
                        vm.reps = response;
                    })
            }

            // Un Follows the given user
            function removeFollower(userId, followerId) {
                userService
                    .removeFollower(userId, followerId)
                    .then(function (response) {
                        vm.followers = response;
                    })
            }

            // Un Follows the given user
            function removeFollowing(userId, followerId) {
                userService
                    .removeFollowing(userId, followerId)
                    .then(function (response) {
                        vm.following = response;
                    })
            }

            // Follows the given user
            function followUser(followerId) {
                userService
                    .followUser(vm.userId, followerId)
                    .then(function (response) {
                        console.log("success");
                    })
            }

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

                userService
                    .updatePassword(vm.userId, vm.password.new)
                    .then(function (success) {
                        vm.updatePasswordSuccess = 'Update Successful';
                        vm.updatePasswordFailed = null;
                    }, function (err) {
                        vm.updatePasswordFailed = 'Update Failed: ' + err;
                    });
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
                vm.message = null;
                vm.currentTab = tab.toLowerCase();
                currentTabUrl = 'views/user/templates/tabs/' + tab.toLowerCase() + '.tab.view.client.html';
            }

            // Returns true if the tab is the currently active tab.
            function isCurrentTab(tab) {
                return tab.toLowerCase() === vm.currentTab;
            }

            // Updates the current profile information to reflect any changes.
            function updateProfileInfo() {
                // If you are on another page display that user, otherwise display your information
                var id = vm.otherUser || vm.userId;

                userService
                    .findUserById(id)
                    .then(handleUpdate);

                // Handles the response from updating the user.
                function handleUpdate(user) {
                    vm.savedUser = user;

                    vm.profileInfo = [
                        {label : 'First Name:', value: vm.savedUser.firstName},
                        {label : 'Last Name:', value: vm.savedUser.lastName},
                        {label : 'Email:', value: vm.savedUser.email},
                        {label : 'Member Since:', value: $filter('date')(vm.savedUser.dateCreated)},
                        {label : 'Phone:', value: (vm.savedUser.phone)}
                    ];

                    vm.user = angular.copy(vm.savedUser);

                    userService
                        .findFollowingByUser(vm.userId)
                        .then(function (following) {
                            vm.following = following;
                        });

                    userService
                        .findFollowersByUser(vm.userId)
                        .then(function (followers) {
                            vm.followers = followers;
                        });

                    repService
                        .findRepsByUser(vm.userId)
                        .then(function (reps) {
                            vm.reps = reps;
                        })
                }
            }
        }
})();

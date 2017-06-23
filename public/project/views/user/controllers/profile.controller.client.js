// Profile Controller
(function() {
    "use strict";

    angular
        .module("KnowYourRep")
        .controller("profileController", profileController);

        function profileController($routeParams, $filter, $location, userService, passwordService, repService) {
            var vm = this;

            /**
             * Used for updating a user's password
             * @type {{old: string, new: string, verify: string}}
             */
            vm.password = {
                old: "",
                new: "",
                verify: ""
            };

            function init() {
                updateProfileInfo()
            }
            init();

            vm.update = update;
            vm.updatePassword = updatePassword;
            vm.followUser = followUser;
            vm.removeFollowing = removeFollowing;
            vm.removeFollower = removeFollower;
            vm.deleteRep = deleteRep;
            vm.logout = logout;

            /**
             * Logs the user out and returns them to the login page.
             */
            function logout() {
                userService
                    .logout({})
                    .then(function (response) {
                        $location.url('/login');
                    }, function (err) {
                        $location.url('/login');
                    });
            }


            function deleteRep(repId) {
                clearMessages();
                repService
                    .deleteRep(repId)
                    .then(function (response) {
                        vm.reps = response;
                    }, function (err) {
                        console.log(err);
                    })
            }

            // Un Follows the given user
            function removeFollower(userId, followerId) {
                clearMessages();
                userService
                    .removeFollower(userId, followerId)
                    .then(function (response) {
                        vm.followers = response;
                    })
            }

            // Un Follows the given user
            function removeFollowing(userId, followerId) {
                clearMessages();
                userService
                    .removeFollowing(userId, followerId)
                    .then(function (response) {
                        vm.following = response;
                    })
            }

            // Follows the given user
            function followUser(followerId) {
                clearMessages();
                userService
                    .followUser(followerId)
                    .then(function (response) {
                        console.log("success");
                    })
            }

            /**
             * Updates the user's password.
             */
            function updatePassword() {
                clearMessages();

                if (vm.password.new !== vm.password.verify) {
                    vm.updatePasswordFailed = "Passwords must match!";
                    return;
                }

                var result = passwordService.validate(vm.password.new);
                if (!result.result) {
                    vm.updatePasswordFailed = result.message;
                    return;
                }

                userService
                    .updatePassword(vm.password.old, vm.password.new)
                    .then(function (success) {
                        vm.updatePasswordSuccess = 'Update Successful';
                        vm.updatePasswordFailed = null;
                    }, function (err) {
                        vm.invalidOldPassword = 'Update Failed. Please verify that your old password is correct';
                    });
            }

            /**
             * Updates the current user with the new values in the profile.
             */
            function update() {
                clearMessages();

                if (vm.editForm.$invalid) {
                    return;
                }

                userService
                    .updateUser(vm.user)
                    .then(updateSuccess, updateFailed);

                function updateSuccess(user) {
                    console.log("Success");
                    vm.message = "Update Successful!";
                    updateProfileInfo();
                }

                function updateFailed(error) {
                    console.log(error);
                    vm.errorMessage = "An Error Occurred. Please try again";
                }
            }

            /**
             * Updates the current profile information to reflect any changes that the user might have made.
             * This needs to be called after any change to the user's information.
             */
            function updateProfileInfo() {
                // If you are on another page display that user, otherwise display your information
                vm.otherUser = $routeParams['uid'];

                if (vm.otherUser) {
                    userService
                        .findUserById(vm.otherUser)
                        .then(handleUpdate);
                } else {
                    userService
                        .findCurrentUser()
                        .then(handleUpdate)
                }

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

                    // Create a copy of the user that is editable without changing the original user.
                    vm.user = angular.copy(vm.savedUser);

                    // Show admin button
                    if (vm.otherUser) {
                        vm.admin = false;
                    } else {
                        userService
                            .checkAdmin()
                            .then(function (response) {
                                vm.admin = !(response === '0')
                            }, function (err) {
                                console.log(err);
                            })
                    }

                    // TODO(matt): Make these one call
                    // Populate the following tab.
                    if (vm.otherUser) {
                        userService
                            .findFollowingByUser(vm.otherUser)
                            .then(function (following) {
                                vm.following = following;
                            }, function (err) {
                                vm.following = [];
                            });

                        // Populate the followers tab.
                        userService
                            .findFollowersByUser(vm.otherUser)
                            .then(function (followers) {
                                vm.followers = followers;
                            }, function (err) {
                                vm.followers = [];
                            });

                        // Populate the reps tab.
                        repService
                            .findRepsByUser(vm.otherUser)
                            .then(function (reps) {
                                vm.reps = reps;
                            }, function (err) {
                                vm.reps = [];
                            })
                    } else {
                        userService
                            .findFollowing()
                            .then(function (following) {
                                vm.following = following;
                            }, function (err) {
                                vm.following = [];
                            });

                        // Populate the followers tab.
                        userService
                            .findFollowers()
                            .then(function (followers) {
                                vm.followers = followers;
                            }, function (err) {
                                vm.followers = [];
                            });

                        // Populate the reps tab.
                        repService
                            .findReps()
                            .then(function (reps) {
                                vm.reps = reps;
                            }, function (err) {
                                vm.reps = [];
                            })
                    }
                }
            }

            /**
             * Clears all messages
             */
            function clearMessages() {
                vm.message = null;
                vm.errorMessage = null;
                vm.updatePasswordFailed = null;
                vm.updatePasswordSuccess = null;
                vm.invalidOldPassword = null;
            }
        }
})();

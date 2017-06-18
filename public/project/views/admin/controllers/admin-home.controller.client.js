/**
 * Admin Home Controller
 * Created by Matt on 6/18/17.
 */
(function () {
  'use strict';

  angular
      .module('KnowYourRep')
      .controller('adminHomeController', adminHomeController);

  function adminHomeController(adminService) {
      var vm = this;

      var rightTab = 'views/admin/templates/tabs/blank.tab.view.client.html';

      function init() {
          vm.users = [];
      }
      init();

      vm.getRightView = getRightView;
      vm.findAllUsers = findAllUsers;
      vm.deleteUser = deleteUser;
      vm.editUser = editUser;
      vm.updateUser = updateUser;
      vm.createUser = createUser;

      function createUser(user) {
          reset();
          if (user === null || typeof user === 'undefined') {
              vm.user = {};
              rightTab = 'views/admin/templates/tabs/user-new.tab.view.client.html';
              return;
          }

          adminService
              .createUser(user)
              .then(function (success) {
                  vm.message = "Created the user";
                  rightTab = 'views/admin/templates/tabs/users.tab.view.client.html';
                  findAllUsers();
              }, function (err) {
                  vm.error = "Error: " + err;
              })
      }
      
      function updateUser() {
          reset();
          adminService
              .updateUser(vm.user)
              .then(function (success) {
                  vm.message = "Update Success!";
              }, function (err) {
                  vm.error = "Error: " + err;
              })
      }

      function editUser(user) {
          reset();
          vm.user = user;
          rightTab = 'views/admin/templates/tabs/user-edit.tab.view.client.html';
      }

      function deleteUser(userId) {
          reset();
          adminService
              .deleteUser(userId)
              .then(function (success) {
                  rightTab = 'views/admin/templates/tabs/users.tab.view.client.html';
                  findAllUsers();
              }, function (err) {
                  vm.error = "Failed to delete user: " + userId;
              });
      }

      function findAllUsers() {
          reset();
          rightTab = 'views/admin/templates/tabs/users.tab.view.client.html';
          adminService
              .findAllUsers()
              .then(function (users) {
                  vm.users = users;
              })
      }

      function getRightView() {
          return rightTab;
      }

      function reset() {
          vm.message = null;
          vm.error = null;
      }
  }
})();

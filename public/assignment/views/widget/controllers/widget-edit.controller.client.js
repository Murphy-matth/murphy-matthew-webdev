/**
 * Widget Edit Controller
 * Author: Matthew
 */
(function () {
    'use strict';

    angular
        .module('WebAppMaker')
        .controller('widgetEditController', widgetEditController);

    function widgetEditController($routeParams, $location, WidgetService) {

        var vm = this;

        function init() {
            vm.userId = $routeParams['uid'];
            vm.websiteId = $routeParams['wid'];
            vm.pageId = $routeParams['pid'];
            vm.widgetId = $routeParams['wigid'];
            vm.widgetTypes = WidgetService.getWidgetTypes();
            WidgetService
                .findWidgetById(vm.widgetId)
                .then(function(widget) {
                    vm.widget = widget;
                    vm.editableWidget = angular.copy(vm.widget);
                })
        }
        init();


        vm.getWidgetUrlForType = getWidgetUrlForType;
        vm.deleteWidget = deleteWidget;
        vm.updateWidget = updateWidget;

        function updateWidget() {
            vm.nameError = null;

            if (typeof vm.editableWidget.name === 'undefined') {
                vm.nameError = "Please enter a widget name";
                return;
            }
            WidgetService
                .updateWidget(vm.widget._id, vm.editableWidget)
                .then(function(response) {
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/");
                })
        }

        function deleteWidget() {
            vm.nameError = null;

            WidgetService
                .deleteWidget(vm.widget._id)
                .then(function(response) {
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/");
                })
        }

        function getWidgetUrlForType() {
            var type = vm.widget.widgetType;
            return 'views/widget/templates/editors/widget-'+type.toLowerCase()+'-editor.view.client.html';
        }
    }
})();
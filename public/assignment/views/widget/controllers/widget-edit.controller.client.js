/**
 * Widget Edit Controller
 * Author: Matthew
 */
(function () {
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
            vm.widget = WidgetService.findWidgetById(vm.widgetId);
            console.log(vm.widget);
        }
        init();

        vm.editableWidget = angular.copy(vm.widget);

        vm.getWidgetUrlForType = getWidgetUrlForType;
        vm.deleteWidget = deleteWidget;
        vm.updateWidget = updateWidget;

        function updateWidget() {
            WidgetService.updateWidget(vm.widget._id, vm.editableWidget);
            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/");
        }

        function deleteWidget() {
            WidgetService.deleteWidget(vm.widget._id);
            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/");
        }

        function getWidgetUrlForType() {
            var type = vm.widget.widgetType;
            return 'views/widget/templates/editors/widget-'+type.toLowerCase()+'-editor.view.client.html';
        }
    }
})();
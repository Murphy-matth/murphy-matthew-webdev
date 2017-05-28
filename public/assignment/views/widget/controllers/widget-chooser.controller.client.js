/**
 * Widget Choose Controller
 * Author: Matthew
 */
(function () {
    angular
        .module('WebAppMaker')
        .controller('widgetChooseController', widgetChooseController);

    function widgetChooseController($routeParams, $location, WidgetService) {

        var vm = this;

        function init() {
            vm.userId = $routeParams['uid'];
            vm.websiteId = $routeParams['wid'];
            vm.pageId = $routeParams['pid'];
            vm.widgetTypes = WidgetService.getWidgetTypes();
        }
        init();

        vm.createWidgetFromType = createWidgetFromType;

        // Creates an empty widget from the specific type.
        function createWidgetFromType(type) {
            var widget = {
                widgetType: type
            };
            if (type === 'HEADING') {
                widget.size = "1";
            }
            if (type === 'YOUTUBE' || type === 'IMAGE') {
                widget.url = "www.example.com";
                widget.width = "100%";
            }
            var result = WidgetService.createWidget(vm.pageId, widget);
            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/" + result._id);
        }
    }
})();
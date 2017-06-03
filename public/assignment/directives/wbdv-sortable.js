/**
 * Widget sortable directive.
 * Author: Matthew Murphy
 */
(function () {
    angular
        .module('WebAppMaker')
        .directive('wbSortable', wbdvSortable);

    function wbdvSortable($routeParams, WidgetService) {
        var startIndex = -1;
        var stopIndex = -1;

        function linkFunction(scope, element) {
            jQuery(element).sortable({
                axis: 'y',
                start:function(event, ui) {
                    startIndex = (jQuery(ui.item).index)();
                },
                stop:function(event, ui) {
                    stopIndex = (jQuery(ui.item).index)();
                    pageId = $routeParams.pid;
                    WidgetService.sortWidgets(pageId, startIndex, stopIndex);
                }
            });
        }

        return {
            link: linkFunction
        }
    }
})();
/**
 * Widget Service
 * Author: Matthew Murphy
 */
(function() {
    angular
        .module("WebAppMaker")
        .factory("WidgetService", WidgetService);

    function WidgetService($http) {

        var baseUrl = '/api/assignment/';

        var widgetTypes = [
            {"type": "HTML"},
            {"type": "HEADING"},
            {"type": "IMAGE"},
            {"type": "YOUTUBE"},
            {"type": "LABEL"},
            {"type": "TEXT"},
            {"type": "BUTTON"},
            {"type": "LINK"},
            {"type": "DATA TABLE"},
            {"type": "REPEATER"}
        ];

        var api = {
            "createWidget"   : createWidget,
            "findWidgetsByPageId" : findWidgetsByPageId,
            "findWidgetById" : findWidgetById,
            "updateWidget" : updateWidget,
            "updateWidgetUrl" : updateWidgetUrl,
            "deleteWidget" : deleteWidget,
            "getWidgetTypes" : getWidgetTypes,
            "sortWidgets": sortWidgets
        };
        return api;

        function sortWidgets(pageId, startIndex, stopIndex) {
            var url = baseUrl + 'page/' + pageId + '/widget?initial=' + startIndex + '&final=' + stopIndex;
            return $http
                .put(url)
                .then(function(response) {
                    return response.data;
                });
        }

        // Returns the different types of widgets.
        function getWidgetTypes() {
            return widgetTypes;
        }

        // Adds the widget parameter instance to the local widgets array.
        // The new widget's pageId is set to the pageId parameter.
        function createWidget(pageId, widget) {
            var newWidget = angular.copy(widget);

            var url = baseUrl + 'page/' + pageId + '/widget';
            return $http.post(url, newWidget)
                .then(function (response) {
                    return response.data;
                })
        }

        // Retrieves the widgets whose pageId matches the parameter pageId.
        function findWidgetsByPageId(pageId) {
            var url = baseUrl + 'page/' + pageId + '/widget';

            return $http.get(url)
                .then(function (response) {
                    return response.data;
                })
        }

        // Retrieves the widget whose _id matches the widgetId parameter.
        function findWidgetById(widgetId) {
            var url = baseUrl + 'widget/' + widgetId;

            return $http.get(url)
                .then(function (response) {
                    return response.data;
                })
        }

        // Updates the widget whose _id matches the widgetId parameter.
        function updateWidget(widgetId, widget) {
            var url = baseUrl + 'widget/' + widgetId;

            return $http.put(url, widget)
                .then(function (response) {
                    return response.data;
                })
        }

        // Updates the widget whose _id matches the widgetId parameter.
        function updateWidgetUrl(widgetId, newUrl) {
            var url = baseUrl + 'widget/' + widgetId;

            return $http.post(url, {url : newUrl} )
                .then(function (response) {
                    return response.data;
                })
        }

        // Removes the widget whose _id matches the widgetId parameter.
        function deleteWidget(widgetId) {
            var url = baseUrl + 'widget/' + widgetId;

            return $http.delete(url)
                .then(function (response) {
                    return response.data;
                })
        }
    }
})();

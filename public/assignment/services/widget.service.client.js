/**
 * Widget Service
 * Author: Matthew Murphy
 */
(function() {
    angular
        .module("WebAppMaker")
        .factory("WidgetService", WidgetService);

    function WidgetService() {
        // I removed the HTML Widgets as we do not display them yet and it causes problems.
        var widgets = [
            { "_id": "123", "widgetType": "HEADING", "pageId": "321", "size": 2, "text": "GIZMODO", "name": ""},
            { "_id": "234", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum", "name": ""},
            { "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
                "url": "http://lorempixel.com/400/200/", "name": ""},
            { "_id": "567", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum", "name": ""},
            { "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
                "url": "https://youtu.be/AM2Ivdi9c4E", "name": ""},
        ];

        var widgetTypes = [
            {"type": "HTML", "widgetId": "1"},
            {"type": "HEADING", "widgetId": "2"},
            {"type": "IMAGE", "widgetId": "3"},
            {"type": "YOUTUBE", "widgetId": "4"},
            {"type": "LABEL", "widgetId": "5"},
            {"type": "TEXT INPUT", "widgetId": "6"},
            {"type": "BUTTON", "widgetId": "7"},
            {"type": "LINK", "widgetId": "8"},
            {"type": "DATA TABLE", "widgetId": "9"},
            {"type": "REPEATER", "widgetId": "10"}
        ];

        var api = {
            "createWidget"   : createWidget,
            "findWidgetsByPageId" : findWidgetsByPageId,
            "findWidgetById" : findWidgetById,
            "updateWidget" : updateWidget,
            "deleteWidget" : deleteWidget,
            "getWidgetTypes" : getWidgetTypes,
            "getWidgetTypeById" : getWidgetTypeById
        };
        return api;

        function getWidgetTypeById(widgetId) {
            var result = widgetTypes.find(function(widget) {
                return widget.widgetId === widgetId;
            });
            if (typeof result === 'undefined') {
                return null;
            }
            return result;
        }

        // Returns the different types of widgets.
        function getWidgetTypes() {
            return widgetTypes;
        }

        // Adds the widget parameter instance to the local widgets array.
        // The new widget's pageId is set to the pageId parameter.
        function createWidget(pageId, widget) {
            var newWidget = angular.copy(widget);

            // For now use a temporary time stamp until it is assigned by the database.
            newWidget._id = (new Date()).getTime() + ""; // This seems really bad.
            newWidget.pageId = pageId;
            newWidget.name = "Widget Name";
            widgets.push(newWidget);

            return newWidget;
        }

        // Retrieves the widgets in local widgets array whose pageId matches the parameter pageId.
        function findWidgetsByPageId(pageId) {
            var result = widgets.filter(function(widget) {
                return widget.pageId === pageId;
            });
            if (typeof result === 'undefined') {
                return null;
            }
            return result;
        }

        // Retrieves the widget in local widgets array whose _id matches the widgetId parameter.
        function findWidgetById(widgetId) {
            var result = widgets.find(function (widget) {
                return widget._id === widgetId;
            });
            if (typeof result === 'undefined') {
                return null;
            }
            return result;
        }

        // Updates the widget in local widgets array whose _id matches the widgetId parameter.
        function updateWidget(widgetId, widget) {
            for (var ii = 0; ii < widgets.length; ii++) {
                var widge = widgets[ii];
                if (widge._id === widgetId) {
                    widget._id = widgetId;
                    widgets[ii] = widget;
                    break;
                }
            }
        }

        // Removes the widget from local widgets array whose _id matches the widgetId parameter.
        function deleteWidget(widgetId) {
            var widget = widgets.find(function(widget) {
                return widget._id === widgetId;
            });

            var index = widgets.indexOf(widget);
            widgets.splice(index, 1);
        }
    }
})();

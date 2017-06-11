/**
 * MongoDB Widget Model
 * Author: Matthew Murphy
 */

var mongoose = require('mongoose');
var widgetSchema = require('./widget.schema.server');
var q = require('q');
var widgetModel = mongoose.model('AssignmentWidgetModel', widgetSchema);
var pageModel = mongoose.model('AssignmentPageModel');

// API Functions
widgetModel.createWidget = createWidget;
widgetModel.findWidgetsByPage = findWidgetsByPage;
widgetModel.findWidgetById = findWidgetById;
widgetModel.deleteWidget = deleteWidget;
widgetModel.updateWidget = updateWidget;
widgetModel.updateWidgetUrl = updateWidgetUrl;
widgetModel.reorderWidget = reorderWidget;

module.exports = widgetModel;

function reorderWidget(pageId, start, end){
    return widgetModel
                .find({_pageId: pageId})
                .then(function (widgets) {
                    var widget = widgets[start];
                    widgets.splice(start, 1);
                    widgets.splice(end, 0, widget);
                    widgetModel
                        .remove({_pageId: pageId})
                        .then(function (success) {
                            widgetModel.insertMany(widgets);
                        })
                })
}

function updateWidget(widgetId, widget) {
    return widgetModel.update({_id: widgetId}, {
        $set : {
            name: widget.name,
            url: widget.url,
            width: widget.width,
            size: widget.size || 0,
            rows: widget.rows || 0,
            placeholder: widget.placeholder,
            text: widget.text,
            formatted: widget.formatted,
            description: widget.description
        }
    });
}

function updateWidgetUrl(widgetId, url) {
    return widgetModel.update({_id: widgetId}, {
        $set : {
            url: url.url
        }
    });
}

function deleteWidget(widgetId) {
    return widgetModel
        .findByIdAndRemove(widgetId, function (err, widget) {
            if (err) {
                return;
            }
            if (widget) {
                var pageId = widget._pageId;
                pageModel
                    .removeWidget(pageId, widgetId)
                    .then(function (result) {
                        return widget;
                    });
            } else {
                console.log("Error removing widget");
                return "Error";
            }
        });
}

function findWidgetById(widgetId) {
    return widgetModel.findById(widgetId);
}

function findWidgetsByPage(pageId) {
    return widgetModel
        .find({_pageId: pageId})
        .populate('_pageId', 'name')
        .exec();
}

function createWidget(widget, pageId) {
    return widgetModel
        .create(widget)
        .then(function (status) {
            return pageModel
                    .addWidget(pageId, status._id)
                    .then(function (result) {
                        return status;
                    });
        });
}
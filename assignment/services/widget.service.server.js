/**
 * Server side widget service
 * Author: Matthew Murphy
 */

var app = require('../../express.js');

var multer = require('multer'); // npm install multer --save
var upload = multer({ dest: __dirname+'/../../public/assignment/uploads' });

// I removed the HTML Widgets as we do not display them yet and it causes problems.
var widgets = [
    { "_id": "123", "widgetType": "HEADING", "pageId": "321", "size": 2, "text": "GIZMODO", "name": ""},
    { "_id": "234", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum", "name": ""},
    { "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
        "url": "http://lorempixel.com/400/200/", "name": ""},
    { "_id": "567", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum", "name": ""},
    { "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
        "url": "https://youtu.be/AM2Ivdi9c4E", "name": ""}
];

var widgetTypes = [
    {"type": "HTML"},
    {"type": "HEADING"},
    {"type": "IMAGE"},
    {"type": "YOUTUBE"},
    {"type": "LABEL"},
    {"type": "TEXT INPUT"},
    {"type": "BUTTON"},
    {"type": "LINK"},
    {"type": "DATA TABLE"},
    {"type": "REPEATER"}
];

app.post('/api/assignment/page/:pageId/widget', createWidget);
app.post ("/api/assignment/upload", upload.single('myFile'), uploadImage);
app.post('/api/assignment/widget/:widgetId', updateWidgetUrl);
app.get('/api/assignment/page/:pageId/widget', findAllWidgetsForPage);
app.get('/api/assignment/widget/:widgetId', findWidgetById);
app.get('/api/assignment/widget/types', getWidgetTypes);
app.put('/api/assignment/widget/:widgetId', updateWidget);
app.put('/api/assignment/page/:pageId/widget', updateWidgetPosition);
app.delete('/api/assignment/widget/:widgetId', deleteWidget);

function updateWidgetUrl(req, res) {
    var widgetId = req.params.widgetId;
    var url = req.body;

    var result = widgets.find(function(widget) {
        return widget._id === widgetId;
    });

    if (typeof result === 'undefined') {
        res.sendStatus(200);
        return;
    }

    result.url = url.url;
    res.sendStatus(200);
}

function uploadImage(req, res) {

    var widgetId      = req.body.widgetId;
    var userId      = req.body.userId;
    var pageId      = req.body.pageId;
    var websiteId      = req.body.websiteId;
    var width         = req.body.width;
    var myFile        = req.file;

    var originalname  = myFile.originalname; // file name on user's computer
    var filename      = myFile.filename;     // new file name in upload folder
    var path          = myFile.path;         // full path of uploaded file
    var destination   = myFile.destination;  // folder where file is saved to
    var size          = myFile.size;
    var mimetype      = myFile.mimetype;

    console.log(myFile);

    for (var ii = 0; ii < widgets.length; ii++) {
        var widge = widgets[ii];
        if (widge._id === widgetId) {
            widge.url = '/assignment/uploads/'+filename;
            break;
        }
    }

    var callbackUrl   = "/assignment/index.html#!/user/"+userId+"/website/"+websiteId+"/page/"+pageId+"/widget/"+widgetId;

    res.redirect(callbackUrl);
}

function updateWidgetPosition(req, res) {
    var pageId = req.params.pageId;
    var startIndex = req.query['initial'];
    var stopIndex = req.query['final'];

    var result = widgets.filter(function(widget) {
        return widget.pageId === pageId;
    });
    if (typeof result === 'undefined') {
        res.sendStatus(200);
        return;
    }

    var element = result[startIndex];
    var index = widgets.indexOf(element);
    widgets.splice(index, 1);

    var endElement = result[stopIndex];
    var endIndex = widgets.indexOf(endElement);
    widgets.splice(endIndex, 0, element);

    res.sendStatus(200);
}

function getWidgetTypes(req, res) {
    console.log(req);
    res.json(widgetTypes);
}

// Adds the widget parameter instance to the local widgets array.
// The new widget's pageId is set to the pageId parameter.
function createWidget(req, res) {
    var widget = req.body;
    var pageId = req.params.pageId;

    // For now use a temporary time stamp until it is assigned by the database.
    widget._id = (new Date()).getTime() + ""; // This seems really bad.
    widget.pageId = pageId;
    widget.name = "Widget Name";
    widgets.push(widget);

    res.json(widget);
}

// Retrieves the widgets in local widgets array whose pageId matches the parameter pageId.
function findAllWidgetsForPage(req, res) {
    var pageId = req.params.pageId;

    var result = widgets.filter(function(widget) {
        return widget.pageId === pageId;
    });
    if (typeof result === 'undefined') {
        res.sendStatus(200);
        return;
    }
    res.json(result);
}

// Retrieves the widget in local widgets array whose _id matches the widgetId parameter.
function findWidgetById(req, res) {
    var widgetId = req.params.widgetId;

    var result = widgets.find(function (widget) {
        return widget._id === widgetId;
    });
    if (typeof result === 'undefined') {
        res.sendStatus(200);
        return;
    }
    res.json(result);
}

// Updates the widget in local widgets array whose _id matches the widgetId parameter.
function updateWidget(req, res) {
    var widgetId = req.params.widgetId;
    var widget = req.body;

    for (var ii = 0; ii < widgets.length; ii++) {
        var widge = widgets[ii];
        if (widge._id === widgetId) {
            widget._id = widgetId;
            widgets[ii] = widget;
            break;
        }
    }

    res.sendStatus(200);
}

// Removes the widget from local widgets array whose _id matches the widgetId parameter.
function deleteWidget(req, res) {
    var widgetId = req.params.widgetId;

    var widget = widgets.find(function(widget) {
        return widget._id === widgetId;
    });

    var index = widgets.indexOf(widget);
    widgets.splice(index, 1);

    res.sendStatus(200);
}

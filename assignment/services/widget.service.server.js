/**
 * Server side widget service
 * Author: Matthew Murphy
 */

var app = require('../../express.js');
var widgetModel = require('../models/widget/widget.model.server');

var multer = require('multer'); // npm install multer --save
var upload = multer({ dest: __dirname+'/../../public/assignment/uploads' });

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
    widgetModel
        .updateWidgetUrl(req.params.widgetId, req.body)
        .then(function (status) {
            res.send(200);
        })
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

    var url = '/assignment/uploads/'+ filename;

    widgetModel
        .updateWidgetUrl(widgetId, url)
        .then(function (status) {
            var callbackUrl   = "/assignment/index.html#!/user/"+userId+"/website/"+websiteId+"/page/"+pageId+"/widget/"+widgetId;

            res.redirect(callbackUrl);
        });
}

function updateWidgetPosition(req, res) {
    var pageId = req.params.pageId;
    var startIndex = req.query['initial'];
    var stopIndex = req.query['final'];

    widgetModel
        .reorderWidget(pageId, startIndex, stopIndex)
        .then(function (status) {
            res.sendStatus(200);
        })
}

function getWidgetTypes(req, res) {
    res.json(widgetTypes);
}

// Adds the widget parameter instance to the local widgets array.
// The new widget's pageId is set to the pageId parameter.
function createWidget(req, res) {
    var widget = req.body;

    widget._pageId = req.params.pageId;

    widgetModel
        .createWidget(widget, req.params.pageId)
        .then(function (status) {
            res.json(status._id);
        });
}

// Retrieves the widgets in local widgets array whose pageId matches the parameter pageId.
function findAllWidgetsForPage(req, res) {
    widgetModel
        .findWidgetsByPage(req.params.pageId)
        .then(function (widgets) {
            res.json(widgets);
        });
}

// Retrieves the widget in local widgets array whose _id matches the widgetId parameter.
function findWidgetById(req, res) {
    widgetModel
        .findWidgetById(req.params.widgetId)
        .then(function (widget) {
            res.json(widget);
        });
}

// Updates the widget in local widgets array whose _id matches the widgetId parameter.
function updateWidget(req, res) {
    var widget = req.body;
    widgetModel
        .updateWidget(req.params.widgetId, widget)
        .then(function (status) {
            res.json(widget);
        });
}

// Removes the widget from local widgets array whose _id matches the widgetId parameter.
function deleteWidget(req, res) {
    widgetModel
        .deleteWidget(req.params.widgetId)
        .then(function (status) {
            res.sendStatus(200);
        });
}

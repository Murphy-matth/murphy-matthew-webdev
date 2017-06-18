/**
 * Server side app.js file for my web dev project.
 * Author: Matthew Murphy
 */

var connectionString = 'mongodb://127.0.0.1:27017/webdev_summer1_assignment_2017';

if(process.env.MLAB_USERNAME) {
    connectionString = process.env.MLAB_USERNAME + ":" +
        process.env.MLAB_PASSWORD + "@" +
        process.env.MLAB_HOST + ':' +
        process.env.MLAB_PORT + '/' +
        process.env.MLAB_APP_NAME;
}

var mongoose = require("mongoose");
var db = mongoose.connect(connectionString);

require('./modules/authenticator.service.server');
require('./services/user.service.server.js');
require('./services/image.service.server.js');
require('./services/feed.service.server');
require('./services/rep.service.server');
require('./services/proPublica.service.server');

"use strict";

const path = require('path');
const connect = require('connect');
const bodyParser = require('body-parser');
const createRoutes = require('./routes');

function createApp(mq) {
    const app = connect();

    app.use(bodyParser.json());
    app.use(createRoutes(mq));

    return app;
};

module.exports = createApp;
"use strict";

const http = require('http');
const config = require('config');
const createApp = require('./server');

// TODO: Make this a separate npm module
const MQAdapter = require('./lib/adapters/in-memory');
const app = createApp(new MQAdapter());

//TODO: Support clustering
const server = http.createServer(app);
const serverPort = config.get('server.port');
server.listen(serverPort);
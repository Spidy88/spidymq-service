SpidyMQ Server
==============

A SpidyMQ server for all your (simple) message queue needs. Currently this server utilizes an in-memory message queue.
Users can create two kinds of channels. The first is a round-robin channel in which messages are distributed to 
subscribers in an individual, even fashion. This means subscribers share in the work rather then each getting the same
messages. The second kind of channel is a broadcast channel. Subscribers of this channel get every message that comes 
through. Durable messages are not currently supported so if a request fails or the client disconnects for a short 
amount of time, they won't receive any messages that were missed.

## Getting started

To get started, simply install the dependencies.

```
npm install
```
 
## Setting up your environment

Almost ready, I promise, let's get your environment setup. There are a couple ways to manage your environment. You can 
use Node Foreman .env files which get autoloaded when the application is run, or you can create your own 
`config/default.js` configuration file. Config looks at `NODE_ENV` and then loads the corresponding config file. When
`NODE_ENV` is not present, `default` is used. Checkout [config/default.example.js] for an example of what configuration 
values are needed.

## Running the application

Starting the web application is quick and simple. You can use Node Foreman, npm start (which uses Node Foreman), or 
just start `index.js` yourself. You will need to include the --harmony flag since this web application is using plenty 
of neat and shiny ES6 features.

```
nf start
npm start
node --harmony index.js
```
"use strict";

// TODO: Make routes RESTful?
const winston = require('winston');
const request = require('request');
const Router = require('router');
const BadRequestException = require('../lib/errors/bad-request-exception');

// TODO: Implement dependency injection
function createRoutes(mq) {
    const router = Router();

    // Create a channel
    router.post('/channel', createChannel);

    // Subscribe to channel
    router.post('/subscribe', createSubscription);

    // Unsubscribe to channel
    router.post('/unsubscribe', deleteSubscription);

    // Publish message
    router.post('/message', createMessage);

    // TODO: Support ack
    // TODO: Support nack

    return router;

    function createChannel(req, res) {
        winston.debug('Creating a channel');

        let channelName = req.body.name;
        let channelType = req.body.type;

        // TODO: Validate parameters

        mq.createChannel(channelName, { type: channelType }, (err, result) => handleResult(err, result, res));
    }

    function createSubscription(req, res) {
        winston.debug('Subscribing to a channel');

        let channelName = req.body.name;
        let notifyUrl = req.body.notifyUrl;
        let subscriber = {
            id: `${channelName}[${notifyUrl}]`,
            notifyUrl: notifyUrl
        };
        subscriber.assignMessage = sendMessage.bind(this, subscriber);

        mq.subscribeChannel(channelName, subscriber, (err, result) => handleResult(err, result, res));
    }

    function deleteSubscription(req, res) {
        winston.debug('Unsubscribing from a channel');

        let channelName = req.body.name;
        let notifyUrl = req.body.notifyUrl;
        let subscriber = {
            id: `${channelName}[${notifyUrl}]`,
            notifyUrl: notifyUrl
        };

        mq.unsubscribeChannel(channelName, subscriber, (err, result) => handleResult(err, result, res));
    }

    function createMessage(req, res) {
        winston.debug('Publishing a message');

        let channel = req.body.channel;
        let content = req.body.content;

        // TODO: Validate parameters

        mq.publishMessage(channel, content, (err, result) => handleResult(err, result, res));
    }
    
    function handleResult(err, result, res) {
        if( err ) {
            res.statusCode = (err instanceof BadRequestException) ? 400 : 500;
            res.end();
            return;
        }
        
        res.statusCode = result ? 200 : 304;
        res.end();
    }

    function sendMessage(subscriber, message) {
        console.log('Sending message to subscriber: ', subscriber, message);
        request
            .post({
                url: subscriber.notifyUrl,
                body: message,
                json: true
            })
            .on('response', function(response) {
                console.log('Message delivered to subscriber');
            })
            .on('error', function(error) {
                console.log('Error delivering message to subscriber');
            });
    }
}

module.exports = createRoutes;
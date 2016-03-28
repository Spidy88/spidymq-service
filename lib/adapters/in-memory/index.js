"use strict";

const _ = require('lodash');
const moment = require('moment');
const winston = require('winston');
const Message = require('./message');
const BroadcastChannel = require('./channels/broadcast.js');
const RoundRobinChannel = require('./channels/round-robin.js');
const BadRequestException = require('../../errors/bad-request-exception');
const channelTypes = {
    'round-robin': RoundRobinChannel,
    'broadcast': BroadcastChannel
};

const idGenerator = function * () {
    let id = 1;

    while(true) {
        yield id++;
    }
};

// TODO: Move to its own npm module
class InMemoryMessageQueue {
    constructor() {
        this._idGenerator = idGenerator();
        this._channels = {};
    }

    channels() {
        return _.map(this._channels, (channel, name) => { return name; });
    }

    createChannel(channelName, options, done) {
        options = options || {};
        options.type = options.type || 'round-robin';
        done = done || function() {};

        // Validate that a channel name was given
        if( !channelName ) {
            return done(new BadRequestException('Cannot create a channel with no name'));
        }

        // Validate channel type exists
        if( !channelTypes.hasOwnProperty(options.type) ) {
            return done(new BadRequestException('Channel type not supported'));
        }

        // If this channel doesn't exist, create it
        if (!this._channels.hasOwnProperty(channelName)) {
            let channelOptions = {
                name: channelName,
                type: options.type
            };
            let Channel = channelTypes[options.type];

            this._channels[channelName] = new Channel(channelOptions);
            winston.info('Created new channel');

            return done(null, true);
        }

        // If the channel exists, and the options match, let them know it already exists
        if( this._channels[channelName].type === options.type ) {
            return done(null, false);
        }

        // If the channel exists but the options are different, throw an exception.
        done(new BadRequestException('Channel already exists but with different options'));
    }

    subscribeChannel(channelName, subscriber, done) {
        done = done || function() {};
        
        // Verify the channel name provided exists
        if( !this._channels.hasOwnProperty(channelName) ) {
            return done(new BadRequestException('Cannot subscribe to a channel that has not been created'));
        }

        let channel = this._channels[channelName];
        let result = channel.addSubscriber(subscriber);

        return done(null, result);
    }

    unsubscribeChannel(channelName, subscriber, done) {
        done = done || function() {};

        // Verify the channel name provided exists
        if( !this._channels.hasOwnProperty(channelName) ) {
            return done(new BadRequestException('Cannot unsubscribe to a channel that has not been created'));
        }

        let channel = this._channels[channelName];
        let result = channel.removeSubscriber(subscriber);

        return done(null, result);
    }

    publishMessage(channelName, content, done) {
        done = done || function() {};

        // Verify the channel name provided exists
        if( !this._channels.hasOwnProperty(channelName) ) {
            done(new BadRequestException('Cannot publish message to a channel that has not been created'));
            return;
        }

        let id = this._nextId();
        let channel = this._channels[channelName];
        let message = new Message(id, channelName, content);

        winston.info('Message queued');
        channel.enqueue(message);
        done(null);
    }

    // TODO: Ack message
    // TODO: Nack message

    _nextId() {
        return this._idGenerator.next().value;
    }
}

module.exports = InMemoryMessageQueue;
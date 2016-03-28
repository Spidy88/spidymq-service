"use strict";

const _ = require('lodash');

class BroadcastChannel {
    constructor(config) {
        this.name = config.name;
        this.type = 'broadcast';
        this._subscribers = [];
    }

    addSubscriber(subscriber) {
        let subscriberIndex = _.findIndex(this._subscribers, (sub) => sub.id === subscriber.id);

        if( subscriberIndex !== -1 ) {
            return false;
        }

        this._subscribers.push(subscriber);
        return true;
    }

    removeSubscriber(subscriber) {
        let subscriberIndex = _.findIndex(this._subscribers, (sub) => sub.id === subscriber.id);

        if( subscriberIndex === -1 ) {
            return false;
        }

        this._subscribers.splice(subscriberIndex, 1);
    }

    enqueue(message) {
        _.forEach(this._subscribers, (subscriber) => subscriber.assignMessage(message));
    }
}

module.exports = BroadcastChannel;
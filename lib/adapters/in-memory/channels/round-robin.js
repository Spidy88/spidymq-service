"use strict";

const _ = require('lodash');

class RoundRobinChannel {
    constructor(config) {
        this.name = config.name;
        this.type = 'round-robin';
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
        let nextSubscriber = this._getNextSubscriber();
        
        if( nextSubscriber !== null ) {
            console.log('Sending subscriber message');
            nextSubscriber.assignMessage(message);
        }
    }

    _getNextSubscriber() {
        if( this._subscribers.length === 0 ) {
            return null;
        }

        // Put the first subscriber at the end of the line
        let nextSubscriber = this._subscribers.shift();
        this._subscribers.push(nextSubscriber);

        return nextSubscriber;
    }
}

module.exports = RoundRobinChannel;
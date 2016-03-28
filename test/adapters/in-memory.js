"use strict";

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const mockery = require('mockery');

// Add chai should and sinonChai to mocha tests
chai.should();
chai.use(sinonChai);

// Before testing gets underway, enable mockery to start intercepting `require`
before(function() {
    //mockery.enable();
});

// After testing finished, disable mockery
after(function() {
    // mockery.deregisterAll();
    // mockery.disable();
});

describe('InMemoryMessageQueue', function() {
    let MessageQueue;
    let mq;

    beforeEach(function() {
        // mockery.registerAllowables([
        //     ' ../../lib/adapters/in-memory',
        //     'lodash',
        //     'moment',
        //     'winston',
        //     './message',
        //     './channels/broadcast.js',
        //     './channels/round-robin.js',
        //     '../../errors/bad-request-exception'
        // ]);

        // Require after mockery mocks are in place
        MessageQueue = require('../../lib/adapters/in-memory');

        mq = new MessageQueue();
    });

    afterEach(function() {
        //mockery.deregisterAll();
    });

    describe('api', function() {
        it('should have a createChannel()', function() {
            mq.should.respondTo('createChannel');
        });

        it('should have a subscribeChannel()', function() {
            mq.should.respondTo('subscribeChannel');
        });

        it('should have an unsubscribeChannel()', function() {
            mq.should.respondTo('unsubscribeChannel');
        });

        it('should have an publishMessage()', function() {
            mq.should.respondTo('publishMessage');
        });
    });

    describe('behavior', function() {
    });
});

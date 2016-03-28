"use strict";

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const mockery = require('mockery');

// Add chai should and sinonChai to mocha tests
const should = chai.should();
chai.use(sinonChai);

/* These tests are from the original spidymq-service I wrote, which attempted to utilize sockets and durable messages.
 * Needless to say it was overkill and I scrapped it for http requests. So these all need to be rewritten.

// Before testing gets underway, enable mockery to start intercepting `require`
before(function() {
    mockery.enable();
});

// After testing finished, disable mockery
after(function() {
    mockery.deregisterAll();
    mockery.disable();
});

describe('Client', function() {
    let Client;
    let client;
    let socketMock;

    beforeEach(function() {
        socketMock = {};

        mockery.registerAllowables([
            '../lib/client',
            './request',
            'events'
        ]);

        // Require Client after mockery mocks are in place
        Client = require('../lib/client');
    });

    afterEach(function() {
        mockery.deregisterAll();
    });

    describe('api', function() {
        beforeEach(function() {
            socketMock.on = sinon.stub();

            client = new Client(socketMock);
        });

        it('should have an on()', function() {
            client.should.respondTo('on');
        });
    });

    describe('behavior', function() {
        const testRequest = {
            id: 1,
            type: 'create-channel',
            name: 'test',
            exchange: 'default'
        };
        let socketEventCallbacks;

        beforeEach(function() {
            socketEventCallbacks = {};
            socketMock.on = function(event, cb) { socketEventCallbacks[event] = cb; };
            socketMock.end = sinon.spy();

            client = new Client(socketMock);
        });

        it('should listen for socket data events', function() {
            should.exist(socketEventCallbacks.data);
            socketEventCallbacks.data.should.be.a('function');
        });

        describe('when the client receives a partial request', function() {
            it('should not emit a "request" event', function() {
                let eventCallback = sinon.spy();
                let requestString = JSON.stringify(testRequest);
                let partialRequestString = requestString.substr(0, requestString.length / 2);
                let partialData = '' + requestString.length + '#' + partialRequestString;
                let requestBuffer = new Buffer(partialData);

                client.on('request', eventCallback);
                socketEventCallbacks.data(requestBuffer);

                eventCallback.should.not.have.been.called;
            });
        });

        describe('when the client receives a full request', function() {
            it('should emit a "request" event', function() {
                let eventCallback = sinon.spy();
                let requestString = JSON.stringify(testRequest);
                let requestData = '' + requestString.length + '#' + requestString;
                let requestBuffer = new Buffer(requestData);

                client.on('request', eventCallback);
                socketEventCallbacks.data(requestBuffer);

                eventCallback.should.have.been.calledOnce;
            });
        });

        describe('when the client receives multiple requests', function() {
            it('should emit a "request" event for each full request', function() {
                let eventCallback = sinon.spy();
                let requestString = JSON.stringify(testRequest);
                let requestData = '' + requestString.length + '#' + requestString;
                let partialRequestString = requestString.substr(0, requestString.length / 2);
                let partialData = '' + requestString.length + '#' + partialRequestString;

                let requestBuffer = new Buffer(requestData + requestData + partialData);

                client.on('request', eventCallback);
                socketEventCallbacks.data(requestBuffer);

                eventCallback.should.have.been.calledTwice;
            });

            it('should remember partial requests and emit a "request" event once they complete', function() {
                let eventCallback = sinon.spy();
                let requestString = JSON.stringify(testRequest);
                let partialRequestString1 = requestString.substr(0, requestString.length / 2);
                let partialRequestString2 = requestString.substr(requestString.length / 2);
                let partialData1 = '' + requestString.length + '#' + partialRequestString1;
                let partialData2 = partialRequestString2;
                let requestBuffer1 = new Buffer(partialData1);
                let requestBuffer2 = new Buffer(partialData2);

                client.on('request', eventCallback);
                socketEventCallbacks.data(requestBuffer1);
                eventCallback.should.not.have.been.called;

                socketEventCallbacks.data(requestBuffer2);
                eventCallback.should.have.been.calledOnce;
            });
        });

        describe('when the client sends a malformed request', function() {
            let requestEventCallback;
            let errorEventCallback;

            beforeEach(function() {
                requestEventCallback = sinon.spy();
                errorEventCallback = sinon.spy();

                client.on( 'request', requestEventCallback );
                client.on( 'error', errorEventCallback );
            })

            describe('when a request length is not provided as a number', function() {
                it( 'should emit an "error" event', function () {
                    let requestString = JSON.stringify(testRequest);
                    let requestData = 'Number#' + requestString;
                    let requestBuffer = new Buffer(requestData);

                    socketEventCallbacks.data( requestBuffer );

                    requestEventCallback.should.not.have.been.called;
                    errorEventCallback.should.have.been.calledOnce;
                });

                it('should disconnect', function() {
                    let requestString = JSON.stringify(testRequest);
                    let requestData = 'Number#' + requestString;
                    let requestBuffer = new Buffer(requestData);

                    socketEventCallbacks.data( requestBuffer );

                    socketMock.end.should.have.been.calledOnce;
                    client.isConnected().should.be.false;
                });
            });

            describe('when a # is not found', function() {
                it('should emit an "error" event', function() {
                    let requestData = Array(24).join('0');
                    let requestBuffer = new Buffer(requestData);

                    socketEventCallbacks.data( requestBuffer );

                    requestEventCallback.should.not.have.been.called;
                    errorEventCallback.should.have.been.calledOnce;
                });

                it('should disconnect', function() {
                    let requestData = Array(24).join('0');
                    let requestBuffer = new Buffer(requestData);

                    socketEventCallbacks.data( requestBuffer );

                    socketMock.end.should.have.been.calledOnce;
                    client.isConnected().should.be.false;
                });
            });

            describe('when invalid json is given', function() {
                it('should emit an "error" event', function() {
                    let requestString = 'not valid json';
                    let requestData = '' + requestString.length + '#' + requestString;
                    let requestBuffer = new Buffer(requestData);

                    socketEventCallbacks.data( requestBuffer );

                    socketMock.end.should.have.been.calledOnce;
                    client.isConnected().should.be.false;
                });

                it('should disconnect', function() {
                    let requestString = 'not valid json';
                    let requestData = '' + requestString.length + '#' + requestString;
                    let requestBuffer = new Buffer(requestData);

                    socketEventCallbacks.data( requestBuffer );

                    socketMock.end.should.have.been.calledOnce;
                    client.isConnected().should.be.false;
                });
            });
        });

        describe('when the client disconnects', function() {
            
        });

        describe('when the client has an unrecoverable error', function() {

        });
    });
});
*/
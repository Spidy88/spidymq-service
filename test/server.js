"use strict";

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const mockery = require('mockery');

// Add chai should and sinonChai to mocha tests
chai.should();
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

describe('Server', function() {
    const testPort = 5000;

    let Server;
    let server;
    let netMock;
    let serverSocketMock;
    let serverSocketEventCallbacks;
    let clientMock;

    beforeEach(function() {
        netMock = {};
        serverSocketMock = {};
        clientMock = {};
        serverSocketEventCallbacks = {};

        // Using a stub to return serverSocketMock seems to return the mock in its current state at the point of this call
        netMock.createServer = function() { return serverSocketMock; };
        serverSocketMock.on = function(event, cb) { serverSocketEventCallbacks[event] = cb; };

        mockery.registerAllowables([
            '../lib/server',
            './request',
            'events'
        ]);
        mockery.registerMock('net', netMock);
        mockery.registerMock('./client', {});

        // Require Server after mockery mocks are in place
        Server = require('../lib/server');

        server = new Server(testPort);
    });

    afterEach(function() {
        mockery.deregisterAll();
    });

    describe('api', function() {
        it('should have a start()', function() {
            server.should.respondTo('start');
        });

        it('should have a shutdown()', function() {
            server.should.respondTo('shutdown');
        });
        
        it('should have an on()', function() {
            server.should.respondTo('on');
        });
    });

    describe('behavior', function() {
        describe('#start', function() {
            describe('when server is able to start', function() {
                beforeEach(function () {
                    serverSocketMock.listen = sinon.stub().callsArg(1);
                });

                it('should execute our callback', function () {
                    let callback = sinon.spy();

                    server.start(callback);

                    callback.should.have.been.calledOnce;
                });

                it('should emit a "started" event', function () {
                    let eventCallback = sinon.spy();

                    server.on('started', eventCallback);
                    server.start();

                    eventCallback.should.have.been.calledOnce;
                });
            });

            describe('when the server is unable to start', function() {
                beforeEach(function () {
                    // When listen is invoked, call our error event callback if it was registered
                    serverSocketMock.listen = serverSocketMock.listen = function () {
                        let testError = new Error('testing');
                        serverSocketEventCallbacks.error && serverSocketEventCallbacks.error(testError);
                    };
                });

                it('should emit an "error" event', function () {
                    let eventCallback = sinon.spy();

                    server.on('error', eventCallback);
                    server.start();

                    eventCallback.should.have.been.calledOnce;
                });

                it('should not execute our callback', function () {
                    let callback = sinon.spy();

                    server.on('error', sinon.stub());
                    server.start(callback);

                    callback.should.not.have.been.called;
                });
            });

            describe('when the server is already running', function() {
                let listenCallCount;

                beforeEach(function() {
                    listenCallCount = 0;
                    serverSocketMock.listen = function(port, cb) {
                        listenCallCount++;
                        cb && cb();
                    };
                });

                it('should not attempt to start the server', function() {
                    let callback = sinon.spy();

                    server.start(callback);
                    server.start(callback);

                    listenCallCount.should.equal(1);
                });

                it('should not call our callback', function() {
                    let callback = sinon.spy();

                    server.start(callback);
                    server.start(callback);

                    callback.should.have.been.calledOnce;
                });

                it('should not emit a "started" event', function() {
                    let eventCallback = sinon.spy();

                    server.start();
                    server.on('started', eventCallback);
                    server.start();

                    eventCallback.should.not.have.been.called;
                });
            });
        });
        
        describe('#shutdown', function() {
            beforeEach(function() {
                serverSocketMock.listen = sinon.stub().callsArg(1);
            });

            describe('when the server is running', function() {
                it('should execute our callback', function() {
                    let callback = sinon.spy();

                    server.start();
                    server.shutdown(callback);

                    callback.should.have.been.calledOnce;
                });

                it('should emit a "stopped" event', function() {
                    let eventCallback = sinon.spy();

                    server.on('stopped', eventCallback);
                    server.start();
                    server.shutdown();

                    eventCallback.should.have.been.calledOnce;
                });
            });

            describe('when the server is not running', function() {
                it('should not execute our callback', function() {
                    let callback = sinon.spy();

                    server.shutdown(callback);

                    callback.should.not.have.been.called;
                });

                it('should not emit a "stopped" event', function() {
                    let eventCallback = sinon.spy();

                    server.on('stopped', eventCallback);
                    server.shutdown();

                    eventCallback.should.not.have.been.called;
                });
            });
        });
    });
});
*/
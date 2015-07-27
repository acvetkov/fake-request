describe('fake-request', function () {

    var assert = require('chai').assert;
    var FakeRequest = require('../src/fake-request');
    var Request = require('../src/request');

    var urls = [
        'http://mydomain.com/path/?a=1&b=2',
        'http://mydomain.com/path/?a=1',
        'http://mydomain.com/',
        'http://other-domain.com/',
        'http://other-domain.com/?a=1'
    ];

    function sendRequest(url) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.send();
    }

    var globalScope = global || window;

    describe('#mock', function() {

        afterEach(function () {
            FakeRequest.restore();
        });

        it('should be defined', function () {
            assert.isFunction(FakeRequest.mock);
        });

        it('should replace global.XMLHttpRequest', function () {
            var xhr = globalScope.XMLHttpRequest;
            FakeRequest.mock();
            assert.equal(globalScope.XMLHttpRequest, Request);
            assert.notEqual(globalScope.XMLHttpRequest, xhr);
            assert.equal(xhr, FakeRequest.cache);
        });

        it('should replace only once', function () {
            var xhr = globalScope.XMLHttpRequest;
            FakeRequest.mock();
            assert.equal(globalScope.XMLHttpRequest, Request);
            assert.notEqual(globalScope.XMLHttpRequest, xhr);
            assert.equal(xhr, FakeRequest.cache);

            FakeRequest.mock();
            assert.equal(globalScope.XMLHttpRequest, Request);
            assert.notEqual(globalScope.XMLHttpRequest, xhr);
            assert.equal(xhr, FakeRequest.cache);
        });
    });

    describe('#restore', function() {

        it('should be defined', function () {
            assert.isFunction(FakeRequest.restore);
        });

        it('should not override default XMLHttpRequest', function () {
            var xhr = globalScope.XMLHttpRequest;
            FakeRequest.restore();
            assert.equal(xhr, globalScope.XMLHttpRequest);
        });

        it('should restore default XMLHttpRequest from cache', function () {
            var xhr = globalScope.XMLHttpRequest;
            FakeRequest.mock();
            assert.equal(globalScope.XMLHttpRequest, Request);
            FakeRequest.restore();
            assert.equal(xhr, globalScope.XMLHttpRequest);
        });
    });

    describe('#reset', function() {

        before(function () {
            FakeRequest.mock();
        });

        beforeEach(function () {
            FakeRequest.reset();
            urls.forEach(function (url) {
                sendRequest(url);
            });
        });

        after(function () {
            FakeRequest.restore();
        });

        it('should be defined', function () {
            assert.isFunction(FakeRequest.reset);
        });

        it('should reset all requests', function () {
            assert.lengthOf(FakeRequest.requests, 5);
            FakeRequest.reset();
            assert.lengthOf(FakeRequest.requests, 0);
        });

        it('should reset all response data', function () {
            FakeRequest.respond({
                status: 200
            });

            assert.lengthOf(FakeRequest.requests, 5);
            FakeRequest.requests.forEach(function (req) {
                assert.equal(req.status, 200);
            });

            FakeRequest.reset();

            urls.forEach(function (url) {
                sendRequest(url);
            });

            assert.lengthOf(FakeRequest.requests, 5);
            FakeRequest.requests.forEach(function (req) {
                assert.equal(req.status, 0);
            });
        });
    });

    describe('#respond', function() {

        before(function () {
            FakeRequest.mock();
        });

        beforeEach(function () {
            FakeRequest.reset();
        });

        after(function () {
            FakeRequest.restore();
        });

        it('should be defined', function () {
            assert.isFunction(FakeRequest.respond);
        });

        it('sshould respond to all requests, creating before call', function () {
            urls.forEach(function (url) {
                sendRequest(url);
            });
            assert.lengthOf(FakeRequest.requests, 5);

            FakeRequest.requests.forEach(function (req) {
                assert.equal(req.status, 0);
            });

            FakeRequest.respond({
                status: 200
            });

            FakeRequest.requests.forEach(function (req) {
                assert.equal(req.status, 200);
            });
        });

        it('should respond to all requests, creating after call', function () {

            assert.lengthOf(FakeRequest.requests, 0);


            FakeRequest.respond({
                status: 200
            });

            urls.forEach(function (url) {
                sendRequest(url);
            });

            assert.lengthOf(FakeRequest.requests, 5);
            FakeRequest.requests.forEach(function (req) {
                assert.equal(req.status, 200);
            });
        });
    });

    describe('#respondToLast', function() {

        before(function () {
            FakeRequest.mock();
        });

        beforeEach(function () {
            FakeRequest.reset();
        });

        after(function () {
            FakeRequest.restore();
        });

        it('should be defined', function () {
            assert.isFunction(FakeRequest.respondToLast);
        });

        it('should respond to last request', function () {
            sendRequest(urls[0]);
            sendRequest(urls[1]);

            assert.lengthOf(FakeRequest.requests, 2);
            FakeRequest.respondToLast({
                status: 200
            });

            assert.equal(FakeRequest.requests[0].status, 0);
            assert.equal(FakeRequest.requests[1].status, 200);
        });

        it('should not throws exception', function () {

            var func = function () {
                FakeRequest.respondToLast({
                    status: 200
                });
            };

            assert.doesNotThrow(func);
        });
    });

    describe('#get', function() {

        before(function () {
            FakeRequest.mock();
        });

        beforeEach(function () {
            FakeRequest.reset();
        });

        after(function () {
            FakeRequest.restore();
        });

        it('should be defined', function () {
            assert.isFunction(FakeRequest.get);
        });

        it('should return request by number', function () {
            urls.forEach(function (url) {
                sendRequest(url);
            });

            assert.lengthOf(FakeRequest.requests, 5);
            assert.equal(FakeRequest.get(0), FakeRequest.requests[0]);
            assert.equal(FakeRequest.get(4), FakeRequest.requests[4]);
            assert.isUndefined(FakeRequest.get(10));
        });

        it('should return request by regexp', function () {
            urls.forEach(function (url) {
                sendRequest(url);
            });

            var rule1 = /mydomain/;
            var expected = [FakeRequest.requests[0], FakeRequest.requests[1], FakeRequest.requests[2]];
            assert.deepEqual(FakeRequest.get(rule1), expected);

            var rule2 = /mydomain.*b=2/;
            assert.deepEqual(FakeRequest.get(rule2), [FakeRequest.requests[0]]);
        });

        it('should return request by url', function () {

            urls.forEach(function (url) {
                sendRequest(url);
            });

            var url1 = 'http://mydomain.com/path/?a=1';
            assert.deepEqual(FakeRequest.get(url1), [FakeRequest.requests[0], FakeRequest.requests[1]]);

            var url2 = 'http://other-domain.com/';
            assert.deepEqual(FakeRequest.get(url2), [FakeRequest.requests[3], FakeRequest.requests[4]]);
        });
    });

    describe('#respondTo', function () {

        describe('post response', function () {

            before(function () {
                FakeRequest.mock();
            });

            after(function () {
                FakeRequest.restore();
            });

            beforeEach(function () {
                FakeRequest.reset();
                urls.forEach(function (url) {
                    sendRequest(url);
                });
            });

            it('should be defined', function () {
                assert.isFunction(FakeRequest.respondTo);
            });

            it('should respond to request by number', function () {
                FakeRequest.respondTo(4, {
                    status: 200
                });

                FakeRequest.respondTo(3, {
                    status: 401
                });

                FakeRequest.respondTo(2, {
                    status: 400
                });

                assert.equal(FakeRequest.requests[0].status, 0);
                assert.equal(FakeRequest.requests[1].status, 0);
                assert.equal(FakeRequest.requests[2].status, 400);
                assert.equal(FakeRequest.requests[3].status, 401);
                assert.equal(FakeRequest.requests[4].status, 200);
            });

            it('should resolve get params', function () {
                FakeRequest.respondTo('http://mydomain.com/path/?a=1', {
                    status: 200
                });

                assert.equal(FakeRequest.requests[0].status, 200);
                assert.equal(FakeRequest.requests[1].status, 200);
                assert.equal(FakeRequest.requests[2].status, 0);
                assert.equal(FakeRequest.requests[3].status, 0);
                assert.equal(FakeRequest.requests[4].status, 0);
            });

            it('should respond to request by url', function () {
                FakeRequest.respondTo('http://mydomain.com/', {
                    status: 200
                });
                assert.equal(FakeRequest.requests[0].status, 200, 'should respond to ' + FakeRequest.requests[0].url);
                assert.equal(FakeRequest.requests[1].status, 200, 'should respond to ' + FakeRequest.requests[1].url);
                assert.equal(FakeRequest.requests[2].status, 200, 'should respond to ' + FakeRequest.requests[2].url);
                assert.equal(FakeRequest.requests[3].status, 0, 'should not respond to ' + FakeRequest.requests[3].url);
                assert.equal(FakeRequest.requests[4].status, 0, 'should not respond to ' + FakeRequest.requests[4].url);
            });

            it('should respond to request by regexp', function () {
                FakeRequest.respondTo(/other\-domain/, {
                    status: 200
                });

                assert.equal(FakeRequest.requests[0].status, 0);
                assert.equal(FakeRequest.requests[1].status, 0);
                assert.equal(FakeRequest.requests[2].status, 0);
                assert.equal(FakeRequest.requests[3].status, 200);
                assert.equal(FakeRequest.requests[4].status, 200);
            });
        });

        describe('pre response', function () {

            function send() {
                urls.forEach(function (url) {
                    sendRequest(url);
                });
            }

            before(function () {
                FakeRequest.mock();
            });

            after(function () {
                FakeRequest.restore();
            });

            beforeEach(function () {
                FakeRequest.reset();
            });

            it('should be defined', function () {
                assert.isFunction(FakeRequest.respondTo);
            });

            it('should resolve get params', function () {

                FakeRequest.respondTo('http://mydomain.com/path/?a=1', {
                    status: 200
                });

                send();

                assert.equal(FakeRequest.requests[0].status, 200);
                assert.equal(FakeRequest.requests[1].status, 200);
                assert.equal(FakeRequest.requests[2].status, 0);
                assert.equal(FakeRequest.requests[3].status, 0);
                assert.equal(FakeRequest.requests[4].status, 0);
            });

            it('should respond to request by url', function () {
                FakeRequest.respondTo('http://mydomain.com/', {
                    status: 200
                });

                send();

                assert.equal(FakeRequest.requests[0].status, 200, 'should respond to ' + FakeRequest.requests[0].url);
                assert.equal(FakeRequest.requests[1].status, 200, 'should respond to ' + FakeRequest.requests[1].url);
                assert.equal(FakeRequest.requests[2].status, 200, 'should respond to ' + FakeRequest.requests[2].url);
                assert.equal(FakeRequest.requests[3].status, 0, 'should not respond to ' + FakeRequest.requests[3].url);
                assert.equal(FakeRequest.requests[4].status, 0, 'should not respond to ' + FakeRequest.requests[4].url);
            });

            it('should respond to request by regexp', function () {
                FakeRequest.respondTo(/other\-domain/, {
                    status: 200
                });

                send();

                assert.equal(FakeRequest.requests[0].status, 0);
                assert.equal(FakeRequest.requests[1].status, 0);
                assert.equal(FakeRequest.requests[2].status, 0);
                assert.equal(FakeRequest.requests[3].status, 200);
                assert.equal(FakeRequest.requests[4].status, 200);
            });
        });
    });
});
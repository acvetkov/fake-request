describe('request', function() {

    var assert = require('chai').assert;
    var Request = require('../src/request');

    'use strict';

    describe('#onCreate', function() {

        it('should be defined', function () {
            assert.isFunction(Request.onCreate);
        });

        it('should call handler', function () {
            Request.onCreate(function (req) {
                assert.instanceOf(req, Request);
            });
            var req = new Request();
        });
    });

    describe('#onSend', function() {

        it('should be defined', function () {
            assert.isFunction(Request.onSend);
        });

        it('should call handler', function () {
            Request.onSend(function (req) {
                assert.instanceOf(req, Request);
            });
            var request = new Request();
            request.send();
        });
    });

    describe('#respond', function () {

        it('should be defined', function () {
            var req = new Request();
            assert.isFunction(req.respond);
        });

        it('should apply all responded data', function () {
            var req = new Request();
            req.respond({
                status: 200,
                customField: 123,
                response: 'text'
            });
            assert.equal(req.status, 200);
            assert.equal(req.customField, 123);
            assert.equal(req.response, 'text');
        });

        it('should be responded', function () {
            var req = new Request();
            assert.notOk(req.responded);
            req.respond({});
            assert.ok(req.responded);
        });

        it('should set response status', function () {
            var req = new Request();
            assert.notOk(req.responded);
            req.respond({
                status: 201
            });
            assert.equal(req.status, 201);
        });

        it('should set 200 status by default', function () {
            var req = new Request();
            assert.notOk(req.responded);
            req.respond({});
            assert.equal(req.status, 200);
        });

        it('should call event handler, subscribed by addEventListener', function () {
            function handler(event) {
                assert.equal(this, xhr);
                assert.equal(event.type, 'load');
                assert.equal(event.target, xhr);
            }
            var xhr = new Request();
            xhr.addEventListener('load', handler);
            xhr.respond({});
        });

        it('should call event handler, subscribed by onload', function () {
            function handler(event) {
                assert.equal(this, xhr);
                assert.equal(event.type, 'load');
                assert.equal(event.target, xhr);
            }
            var xhr = new Request();
            xhr.onload = handler;
            xhr.respond({});
        });
    });

    describe('#fail', function () {

        it('should be defined', function () {
            var req = new Request();
            assert.isFunction(req.fail);
        });

        it('should apply all responded data', function () {
            var req = new Request();
            req.fail({
                status: 500,
                customField: 123,
                response: 'text'
            });
            assert.equal(req.status, 500);
            assert.equal(req.customField, 123);
            assert.equal(req.response, 'text');
        });

        it('should be responded', function () {
            var req = new Request();
            assert.notOk(req.responded);
            req.fail({});
            assert.ok(req.responded);
        });

        it('should set response status', function () {
            var req = new Request();
            assert.notOk(req.responded);
            req.fail({
                status: 503
            });
            assert.equal(req.status, 503);
        });

        it('should call event handler, subscribed by addEventListener', function () {
            function handler(event) {
                assert.equal(this, xhr);
                assert.equal(event.type, 'error');
                assert.equal(event.target, xhr);
            }
            var xhr = new Request();
            xhr.addEventListener('error', handler);
            xhr.fail({});
        });

        it('should call event handler, subscribed by onload', function () {
            function handler(event) {
                assert.equal(this, xhr);
                assert.equal(event.type, 'error');
                assert.equal(event.target, xhr);
            }
            var xhr = new Request();
            xhr.onerror = handler;
            xhr.fail({});
        });
    });

    describe('#abort', function () {

        it('should be defined', function () {
            var req = new Request();
            assert.isFunction(req.abort);
        });

        it('should apply all responded data', function () {
            var req = new Request();
            req.abort({
                status: 500,
                customField: 123,
                response: 'text'
            });
            assert.equal(req.status, 500);
            assert.equal(req.customField, 123);
            assert.equal(req.response, 'text');
        });

        it('should be responded', function () {
            var req = new Request();
            assert.notOk(req.responded);
            req.abort({});
            assert.ok(req.responded);
        });

        it('should set response status', function () {
            var req = new Request();
            assert.notOk(req.responded);
            req.abort({
                status: 100
            });
            assert.equal(req.status, 100);
        });

        it('should call event handler, subscribed by addEventListener', function () {
            function handler(event) {
                assert.equal(this, xhr);
                assert.equal(event.type, 'abort');
                assert.equal(event.target, xhr);
            }
            var xhr = new Request();
            xhr.addEventListener('abort', handler);
            xhr.abort({});
        });

        it('should call event handler, subscribed by onload', function () {
            function handler(event) {
                assert.equal(this, xhr);
                assert.equal(event.type, 'abort');
                assert.equal(event.target, xhr);
            }
            var xhr = new Request();
            xhr.onabort = handler;
            xhr.abort({});
        });
    });
});
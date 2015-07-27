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

});
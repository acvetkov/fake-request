describe('request', function() {

    var assert = require('chai').assert;
    var sinon = require('sinon');
    var Request = require('../src/request');

    'use strict';

    describe('#onCreate', function() {

        it('should be defined', function () {
            assert.isFunction(Request.onCreate);
        });

        it('should call handler', function () {
            var spy = sinon.spy();
            Request.onCreate(spy);

            new Request();
            new Request();
            new Request();

            assert.ok(spy.calledThrice);
        });
    });

    describe('#onSend', function() {

        it('should be defined', function () {
            assert.isFunction(Request.onSend);
        });

        it('should call handler', function () {
            var spy = sinon.spy();
            Request.onSend(spy);

            new Request().send();
            new Request().send();

            assert.ok(spy.calledTwice);
        });
    });

});
'use strict';

var Request = require('./request');

module.exports = {

    isFakeSet: false,
    cache: null,
    requests: [],
    globalScope: global || window,

    /**
     * Replace XMLHttpRequest by fake request
     */
    mock: function () {
        var self = this;
        if (!this.isFakeSet) {
            this.isFakeSet = true;
            this.cache = this.globalScope.XMLHttpRequest;
            this.globalScope.XMLHttpRequest = Request;
            Request.onCreate(function (request) {
                self.requests.push(request);
            });
        }
    },

    /**
     * reset all requests state
     */
    reset: function () {
        this.requests.forEach(function (request) {
            request.reset();
        });
        this.requests = [];
    },

    /**
     * Restore mock objects
     */
    restore: function () {
        this.reset();
        this.globalScope.XMLHttpRequest = this.cache;
        this.cache = null;
        this.isFakeSet = false;
    },

    /**
     * respond to specified request number
     * @param {Number} requestNumber
     * @param {Object} data
     */
    respondTo: function (requestNumber, data) {
        var request = this.requests[requestNumber];
        if (request) {
            request.respond(data);
        }
    },

    /**
     * respond to last query
     * @param {Object} data
     */
    respondToLast: function (data) {
        var lastRequest = this.lastRequest;
        if (lastRequest) {
            lastRequest.respond(data);
        }
    },

    /**
     * returns last request
     * @returns {Request}
     */
    get lastRequest() {
        if (this.requests.length > 0) {
            return this.requests[this.requests.length - 1];
        }
    }

};
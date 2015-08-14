/*global global*/

(function (globalScope) {

    'use strict';

    var Request = require('./request');
    var URI = require('URIjs');
    var utils = require('./utils');

    module.exports = {

        isFakeSet: false,
        cache: null,
        requests: [],
        globalScope: globalScope,

        responseToAll: null,
        urlResponseBuffer: [],

        /**
         * Replace XMLHttpRequest by fake request
         */
        mock: function () {
            if (!this.isFakeSet) {
                this.isFakeSet = true;
                this.cache = this.globalScope.XMLHttpRequest;
                this.globalScope.XMLHttpRequest = Request;
                this._listenRequest();
            }
        },

        /**
         * reset all requests state
         */
        reset: function () {
            this.requests = [];
            this.responseToAll = null;
            this.urlResponseBuffer = [];
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
         * Respond to all requests
         * @param {Object} data
         */
        respond: function (data) {
            this.responseToAll = data;
            this._applyResponses();
        },

        /**
         * respond to specified request number
         * @param {String|RegExp|Number} req
         * @param {Object} data
         */
        respondTo: function (req, data) {
            if (utils.isNumber(req)) {
                return this._applyResponseToId(req, data);
            }
            this.urlResponseBuffer.push({
                rule: req,
                response: data
            });
            this._applyResponses();
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
         * get queries by specified param
         * @param {Number|String|RegExp} param
         * @returns {Request|Array<Request>}
         */
        get: function (param) {
            if (utils.isNumber(param)) {
                return this._getRequest(param);
            }
            return this.requests.filter(function (request) {
                return this._isValid(request, param);
            }, this);
        },

        /**
         * listen request events
         * @private
         */
        _listenRequest: function () {
            var self = this;
            Request.onCreate(function (request) {
                self.requests.push(request);
            });
            Request.onSend(function () {
                self._applyResponses();
            });
        },

        /**
         * apply response to request
         * @param {Number} id
         * @param {Object} response
         * @private
         */
        _applyResponseToId: function (id, response) {
            var request = this._getRequest(id);
            if (request) {
                request.respond(response);
            }
        },

        /**
         * apply response
         * @private
         */
        _applyResponses: function () {
            this._applyUrlResponse();
            this._applyAllResponse();
        },

        /**
         * apply response to specific urls
         * @private
         */
        _applyUrlResponse: function () {
            this.requests.forEach(function (request) {
                this.urlResponseBuffer.forEach(function (data) {
                    if (this._isValid(request, data.rule)) {
                        request.respond(data.response);
                    }
                }, this);
            }, this);
        },

        /**
         * is valid request url for specified rule
         * @param {Request} request
         * @param {String|RegExp} rule
         * @private
         */
        _isValid: function (request, rule) {
            if (utils.isRegexp(rule)) {
                return rule.test(request.url);
            }
            if (utils.isString(rule)) {
                return this._isValidURI(request, rule);
            }
        },

        /**
         * is equal uri
         * @param {Request} request
         * @param {String} rule
         * @returns {*|Boolean}
         * @private
         */
        _isValidURI: function (request, rule) {
            var compareURI = new URI(rule);
            var originalURI = request.uri;
            return utils.isEqualsURI(originalURI, compareURI);
        },

        /**
         * apply response to all requests
         * @private
         */
        _applyAllResponse: function () {
            if (this.responseToAll) {
                this.requests.forEach(function (request) {
                    this._applyResponse(request, this.responseToAll);
                }, this);
            }
        },

        /**
         * respond to request
         * @param {Request} request
         * @param {Object} response
         * @private
         */
        _applyResponse: function (request, response) {
            if (!request.responded) {
                request.respond(response);
            }
        },

        /**
         * get request by number
         * @param {Number} reqNumber
         * @returns {*}
         */
        _getRequest: function (reqNumber) {
            if (this.requests[reqNumber]) {
                return this.requests[reqNumber];
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

})(global || window);

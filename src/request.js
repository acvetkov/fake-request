(function () {

    'use strict';

    var URI = require('URIjs');
    var utils = require('./utils');

    var onCreateCallback;
    var onSendCallback;

    /**
     * Request (Fake XMLHttpRequest)
     * @constructor
     */
    var Request = function () {
        this.status = 0;
        this.headers = {};
        this.responseHeaders = '';
        this.method = 'GET';
        this.async = true;
        this.queryParams = '';
        this.readyState = 0;
        this.withCredentials = false;
        this.responseType = '';

        if (utils.isFunction(onCreateCallback)) {
            onCreateCallback(this);
        }
    };

    /**
     * invokes xhr instance
     * @param {Function} callback
     */
    Request.onCreate = function (callback) {
        onCreateCallback = callback;
    };

    /**
     * trigger send request
     * @param {Function} callback
     */
    Request.onSend = function (callback) {
        onSendCallback = callback;
    };

    Request.prototype = {

        /**
         * Listen xhr events
         * @param type
         * @param handler
         */
        addEventListener: function (type, handler) {
            this['on' + type] = handler;
        },

        /**
         * Set request header
         * @param {String} header
         * @param {String} value
         */
        setRequestHeader: function (header, value) {
            this.headers[header] = value;
        },

        /**
         * Open request
         * @param {String} method
         * @param {String} url
         * @param {Boolean} [async]
         */
        open: function (method, url, async) {
            this.method = method;
            this.url = url;
            this.async = typeof async === 'undefined' ? true : async;
        },

        /**
         * Send request
         * @param {*} data
         */
        send: function (data) {
            this.data = data;

            if (utils.isFunction(onSendCallback)) {
                onSendCallback(this);
            }
        },

        /**
         * abort request
         * @param data
         */
        abort: function (data) {
            this._applyResponse(data);
            this._aborted = true;
            if (utils.isFunction(this.onabort)) {
                this.onabort.call(this);
            }
        },

        /**
         * get response headers
         * @returns {{}|*}
         */
        getAllResponseHeaders: function () {
            return this.responseHeaders;
        },

        /**
         * get header
         * @param header
         * @returns {*}
         */
        getResponseHeader: function (header) {
            var headers = utils.parseHeaders(this.responseHeaders);
            if (headers) {
                return headers[header];
            }
        },

        /**
         * override mime type
         */
        overrideMimeType: function () {

        },

        /**
         * Respond to request
         * @param {Object} data
         */
        respond: function (data) {
            this._applyResponse(data);
            if (utils.isFunction(this.onload)) {
                this.onload.call(this);
            }
            this._responded = true;
        },

        /**
         * update xhr fields
         * @param {Object} data
         * @private
         */
        _applyResponse: function (data) {
            if (data) {
                Object.keys(data).forEach(function (key) {
                    this[key] = data[key];
                }, this);
            }
        },

        /**
         * @returns {string}
         * @private
         */
        _serializeHeaders: function () {
            return Object.keys(this.headers).map(function (header) {
                return header + ': ' + this.headers[header];
            }, this).join('\n');
        },

        /**
         * returns query object
         * @returns {*}
         */
        get query() {
            if (this._urlObject) {
                return this._urlObject.search(true);
            }
        },

        /**
         * returns query string
         * @returns {*}
         */
        get queryString() {
            if (this._urlObject) {
                return this._urlObject.query();
            }
        },

        /**
         * returns source url
         * @returns {String|*}
         */
        get url() {
            return this._url;
        },

        /**
         * get domain
         */
        get domain() {
            if (this._urlObject) {
                return this._urlObject.domain();
            }
        },

        /**
         * get host
         * @returns {*}
         */
        get host() {
            if (this._urlObject) {
                return this._urlObject.host();
            }
        },

        /**
         *
         * @returns {URIjs|*}
         */
        get uriObject() {
            return this._urlObject;
        },

        /**
         * returns request body
         * @returns {*}
         */
        get body() {
            if (typeof this.data === 'string') {
                return URI.parseQuery(this.data);
            }
            return this.data;
        },

        /**
         * returns true, if request aborted
         * @returns {boolean}
         */
        get aborted() {
            return Boolean(this._aborted);
        },

        /**
         * set request url
         * @param {String} value
         */
        set url(value) {
            this._url = value;
            this._urlObject = new URI(value);
        },

        upload: {
            onprogress: utils.stub,
            onuploadprogress: utils.stub
        },

        /**
         * already responded
         * @returns {boolean}
         */
        get responded() {
            return Boolean(this._responded);
        },

        /**
         * URIjs object
         * @returns {*|exports|module.exports}
         */
        get uri() {
            return this._urlObject;
        }
    };

    module.exports = Request;

})();

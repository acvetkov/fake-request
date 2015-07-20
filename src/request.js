(function () {

    'use strict';

    var sinon = require('sinon');
    var URI = require('URIjs');
    var sandbox = sinon.sandbox.create();

    var onCreateCallback;

    var isFunction = function (param) {
        return typeof param === 'function';
    };

    var parseHeaders = function(headers) {
        var lines = headers.split(/\r?\n/);
        var fields = {};
        var index;
        var field;
        var val;
        var lastElement = lines[lines.length - 1];
        if (lastElement.length < 3) {
            lines.pop();
        }
        lines.forEach(function (line) {
            index = line.indexOf(':');
            field = line.slice(0, index).toLowerCase();
            val = line.slice(index + 1).trim();
            fields[field] = val;
        });

        return fields;
    }

    var spyMethods = [
        'setRequestHeader',
        'open',
        'abort',
        'send',
        'getAllResponseHeaders',
        'getResponseHeader',
        'overrideMimeType'
    ];

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

        spyMethods.forEach(function (method) {
            this[method] = sandbox.spy(this, method);
        }, this);

        if (isFunction(onCreateCallback)) {
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
        },

        /**
         * abort request
         * @param data
         */
        abort: function (data) {
            this._applyResponse(data);
            if (isFunction(this.onabort)) {
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
            var headers = parseHeaders(this.responseHeaders);
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
            if (isFunction(this.onload)) {
                this.onload.call(this);
            }
        },

        /**
         * Reset sinon spies
         */
        reset: function () {
            sandbox.reset();
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
         * set request url
         * @param {String} value
         */
        set url(value) {
            this._url = value;
            this._urlObject = new URI(value);
        },

        upload: {
            onprogress: sandbox.spy(),
            onuploadprogress: sandbox.spy()
        }
    };

    module.exports = Request;

})();
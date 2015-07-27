(function () {

    'use strict';

    module.exports = {

        /**
         * parse response headers
         * @param {String} headers
         * @returns {{}}
         */
        parseHeaders: function (headers) {
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
        },

        /**
         * is param function
         * @param {*} param
         * @returns {boolean}
         */
        isFunction: function (param) {
            return typeof param === 'function';
        },

        /**
         * is param string
         * @param {*} param
         * @returns {boolean}
         */
        isString: function (param) {
            return typeof param === 'string';
        },

        /**
         * is param number
         * @param {*} param
         * @returns {boolean}
         */
        isNumber: function (param) {
            return typeof param === 'number';
        },

        /**
         * is param regexp
         * @param {*} param
         * @returns {boolean}
         */
        isRegexp: function (param) {
            return param instanceof RegExp;
        },

        /**
         * compare uri
         * @returns {Boolean}
         */
        isEqualsURI: function (originalURI, compareURI) {
            if (originalURI.host() !== compareURI.host()) {
                return false;
            }
            if (compareURI.path() && compareURI.path() !== '/' && compareURI.path() !== originalURI.path()) {
                return false;
            }
            return this.isEqualsQuery(originalURI.query(true), compareURI.query(true));
        },

        /**
         * @param originalQuery
         * @param compareQuery
         * @returns {Boolean}
         */
        isEqualsQuery: function (originalQuery, compareQuery) {
            if (originalQuery && compareQuery) {
                return Object.keys(compareQuery).every(function (compareKey) {
                    return compareKey in originalQuery;
                })
            }
            return true;
        },

        /**
         * stub function
         */
        stub: function () {

        }
    };

})();

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
         * is param regexp
         * @param {*} param
         * @returns {boolean}
         */
        isRegexp: function (param) {
            return param instanceof RegExp;
        },

        /**
         * stub function
         */
        stub: function () {

        }
    };

})();

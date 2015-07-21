module.exports = function (grunt) {

    'use strict';

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: require('./package.json')
    });

    grunt.config('webpack.build', {
        entry: './src/fake-request.js',
        output: {
            path: 'build/',
            filename: 'fake-request.<%=pkg.version%>.js',
            libraryTarget: 'umd',
            library: 'http'
        }
    });

    grunt.config('uglify.build', {
        files: {
            'build/fake-request.<%=pkg.version%>.min.js': ['build/fake-request.<%=pkg.version%>.js']
        }
    });

    grunt.config('clean.build', {
        src: [
            'build/*.js',
            '!build/*.min.js'
        ]
    });

    grunt.config('jscs.build', {
        src: 'src/**/*.js',
        options: {
            config: '.jscsrc',
            reporter:  'console'
        }
    });

    grunt.config('jshint', {
        options: {
            jshintrc: true,
            reporter: require('jshint-stylish')
        },
        build: 'src/**/*.js'
    });

    grunt.registerTask('code', ['jshint:build', 'jscs']);
    grunt.registerTask('build', ['webpack:build', 'uglify:build', 'clean:build']);
    grunt.registerTask('default', ['code', 'build']);
};

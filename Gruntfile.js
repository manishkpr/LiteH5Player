'use strict';

module.exports = function (grunt) {
    console.log('begin of Gruntfile.js');

    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            options: {
                force: true
            },
            dist: ['dist']
        },
        browserify: {
            dist: {
                files: {
                    'dist/liteH5Player.debug.js': ['./src/index.js']
                },
                options: {
                    browserifyOptions: {
                        debug: true
                    },
                    plugin: [
                        'browserify-derequire', 'bundle-collapser/plugin'
                    ],
                    transform: ['babelify']
                }
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['clean:dist', 'browserify:dist']);
    grunt.registerTask('omClean', ['clean:dist']);
    grunt.registerTask('omBuild', ['browserify:dist']);
};





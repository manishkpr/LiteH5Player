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
        },
        uglify: {
            options: {
                // compress: {
                //     sequences: true,
                //     dead_code: true,
                //     conditionals: true,
                //     booleans: true,
                //     unused: true,
                //     if_return: true,
                //     join_vars: true,
                //     drop_console: false
                //},
                output: {
                    quote_keys: true
                }
            },
            dist: {
                files: {
                    'dist/liteH5Player.min.js': ['dist/liteH5Player.debug.js']
                }
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['clean:dist', 'browserify:dist']);
    grunt.registerTask('omClean', ['clean:dist']);
    grunt.registerTask('omBuild', ['clean:dist', 'browserify:dist', 'uglify:dist']);
};





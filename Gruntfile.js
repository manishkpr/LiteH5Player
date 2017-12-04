module.exports = function (grunt) {
    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
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

    grunt.registerTask('default', ['clean', 'browserify:dist']);
    grunt.registerTask('test', ['clean:dist']);
};





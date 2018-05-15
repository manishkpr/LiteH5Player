'use strict';

module.exports = function(grunt) {
  console.log('begin of Gruntfile.js');

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
      dist: {
        files: {
          'dist/liteH5Player.min.js': ['dist/liteH5Player.debug.js']
        }
      }
    },
    copy: {
      dist: {
        files: {
          './samples/cast/receiver/liteH5Player.debug.js': ['dist/liteH5Player.debug.js'],
          './samples/demo/liteH5Player.debug.js': ['dist/liteH5Player.debug.js']
        }
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['clean:dist', 'browserify:dist', 'copy:dist']);
  grunt.registerTask('omClean', ['clean:dist']);
  grunt.registerTask('omBuild', ['clean:dist', 'browserify:dist', 'uglify:dist']);
};
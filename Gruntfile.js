'use strict';

module.exports = function (grunt) {
  var reloadPort = 35729;
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
  grunt.initConfig({
    develop: {
      server: {
        file: 'app.js'
      }
    },
    watch: {
      server: {
        files: [
          'app.js',
          'lib/*.js'
        ],
        tasks: ['develop'],
        options: {
          nospawn: true
        }
      },
      compass: {
        files: ['public/sass/*.{scss,sass}'],
        tasks: ['compass'],
        options: {
          livereload: reloadPort
        }
      }
    },
    compass: {
      options: {
        sassDir: "public/sass",
        cssDir: "public/css"
      },
      dist: {}
    }
  });

  grunt.registerTask('default', [
    'develop',
    'watch'
  ]);
};

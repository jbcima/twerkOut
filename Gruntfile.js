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
    connect: {
      options: {
        port: 3000,
        hostname: 'localhost'
      },
      dev: {
        options: {
          middleware: function (connect) {
            return [
              require('connect-livereload')(),
              checkForDownload,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'app')
            ];
          }
        }
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
      sass: {
        files: ['public/sass/*.{scss,sass}'],
        tasks: ['compass'],
        options: {
          livereload: reloadPort
        }
      },
      js : {
        files: ['public/js/*.js','public/js/app/*.js'],
        options: {
          livereload: reloadPort
        }
      },
      html: {
        files: ['views/index.html','views/include/*.html'],
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

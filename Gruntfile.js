'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-simple-mocha');

  grunt.initConfig({
    jshint: {
      dev : {
        src:['Gruntfile.js', 'test/**/*.js', 'server.js', 'models/*.js', 'routes/*routes.js']
      },
      options: {
        node: true,
        globals: {
          describe: true,
          it: true,
          before: true,
          after: true,
          beforeEach: true,
          afterEach: true
        }
      }
    },
    simplemocha: {
      option: {
        globals: ['should'],
        timeout: 3000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'tap'
      },
      dev: { src: ['test/**/*.js'] }
    }
  });
  grunt.registerTask('test', ['jshint:dev' , 'simplemocha:dev']);
  grunt.registerTask('default', ['test']);
};

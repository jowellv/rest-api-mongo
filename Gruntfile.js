
'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-simple-mocha');


  grunt.initConfig({
    jshint: {
      dev: { //subtask to have multiple tasks
        src:['Gruntfile.js', 'server.js', 'test/**/*.js','lib/**/*.js','models/**/*.js','routes/**/*.js']
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
      options: {
        globals: ['should'],
        timeout: 3000,
        ignoreLeaks: true,
        ui: 'bdd',
        reporter: 'tap'
      },
      dev: { src: ['test/**/*.js'] }
    }
  });
  grunt.registerTask('test', ['jshint:dev', 'simplemocha:dev']); // 1st arg after 'grunt' 'simplemocha:dev'
  grunt.registerTask('default', ['test']); // default run when just running grunt no args
};

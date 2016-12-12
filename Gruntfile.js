module.exports = function(grunt) {

  grunt.initConfig({
    webpack: {
      default: {
        entry: "./dist/main.js",
        output: {
          path: "dist/",
          filename: "app.js",
        }
      }
    },
    copy: {
      main: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['js/**/*','shader/**/*', 'images/**/*'],
          dest: 'dist/'
        }],
      },
    },
    ts: {
      default: {
        src: ["src/**/*.ts", "!node_modules/**"],
        outDir: "dist/",
        options: {
          sourceMap: false
        }
      }
    },
    watch: {
      scripts: {
        files: ['src/**/*'],
        tasks: ['copy', 'ts', 'webpack'],
        options: {
          spawn: false,
        },
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-ts');

  grunt.registerTask('default', ['copy', 'ts', 'webpack']);
};

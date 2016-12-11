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
        files: ['src/**/*.ts'],
        tasks: ['ts','webpack'],
        options: {
          spawn: false,
        },
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-ts');

  grunt.registerTask('default', ['ts', 'webpack']);
};

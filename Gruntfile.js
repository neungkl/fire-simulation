module.exports = function(grunt) {

  grunt.initConfig({
    ts: {
      default : {
        src: ["src/**/*.ts", "!node_modules/**"],
        outDir: "dist"
      }
    }
  });
  grunt.loadNpmTasks("grunt-ts");
  grunt.registerTask("default", ["ts"]);
};

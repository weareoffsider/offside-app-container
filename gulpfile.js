var gulp = require("gulp")
var using = require("gulp-using")
var ts = require("gulp-typescript")
var rollup = require("rollup-stream")
var source = require("vinyl-source-stream")
var nodeResolve = require("rollup-plugin-node-resolve")
var tsProject = ts.createProject("tsconfig.json")

gulp.task("scripts", function () {
    return tsProject.src()
        .pipe(ts(tsProject, undefined, ts.reporter.fullReporter()))
        .js.pipe(gulp.dest("build"))
        .pipe(using());
});

gulp.task("rollup", ["scripts"], function() {
  return rollup({
    entry: "./build/index.js",
    format: "cjs",
    exports: 'named',
  })
  .pipe(source("offside-app-container.node.js"))
  .pipe(gulp.dest("./dist"))
  .pipe(using());
});

gulp.task("watch", ["scripts", "rollup"], function () {
  gulp.watch("src/**/*.ts", ["scripts"]);
  gulp.watch("build/**/*.js", ["rollup"]);
});

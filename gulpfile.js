var gulp = require("gulp")
var using = require("gulp-using")
var cloneDeep = require("lodash/cloneDeep")
var ts = require("gulp-typescript")
var rename = require("gulp-rename")
var rollup = require("rollup-stream")
var source = require("vinyl-source-stream")
var nodeResolve = require("rollup-plugin-node-resolve")
var tsProject = ts.createProject("tsconfig.json")
var dtsProject = ts.createProject("dtsconfig.json")

var webpack = require('webpack-stream');

var json = require("rollup-plugin-json")
var babel = require("rollup-plugin-babel")

var mergeStream = require("merge-stream")
var connect = require("gulp-connect")

gulp.task("scripts", function () {
    return tsProject.src()
      .pipe(ts(tsProject, undefined, ts.reporter.fullReporter()))
      .js.pipe(gulp.dest("build")).pipe(using())
})

gulp.task("definitions", function () {
    return dtsProject.src()
      .pipe(ts(dtsProject, undefined, ts.reporter.fullReporter()))
      .dts.pipe(gulp.dest("dist")).pipe(using())
})

gulp.task("rollup", function() {
  return rollup({
    entry: "./build/offside-app-container.js",
    format: "cjs",
    plugins: [json(), babel()],
    exports: 'named',
  })
  .pipe(source("offside-app-container.node.js"))
  .pipe(gulp.dest("./dist"))
  .pipe(using())
})


var exampleProject = ts.createProject("exampletsconfig.json")
gulp.task("example:scripts", function () {
  return exampleProject.src()
    .pipe(ts(exampleProject, undefined, ts.reporter.fullReporter()))
    .js.pipe(gulp.dest("build/example")).pipe(using())
})

gulp.task("example:rollup", function () {
  return rollup({
    entry: "./build/example/ExampleApp.js",
    format: "cjs",
    plugins: [json(), babel()],
    exports: 'named',
  })
  .pipe(source("ExampleApp.node.js"))
  .pipe(gulp.dest("./dist"))
  .pipe(using())
})

gulp.task("example:html", function () {
  return gulp.src("./example/*.html")
    .pipe(gulp.dest("./build-web"))
    .pipe(connect.reload())
    .pipe(using())
})


gulp.task("example:webpack", function () {
  return mergeStream(
    gulp.src("./dist/ExampleApp.node.js")
      .pipe(webpack({
        output: {
          filename: "ExampleApp.pkg.js",
        },
        externals: [{
          "offside-app-container": "OffsideAppContainer",
        }],
      }))
      .pipe(gulp.dest('build-web/'))
      .pipe(connect.reload())
      .pipe(using()),

    gulp.src("./dist/offside-app-container.node.js")
      .pipe(webpack({
        output: {
          filename: "ExampleAppDependencies.pkg.js",
          libraryTarget: "var",
          library: "OffsideAppContainer",
        }
      }))
      .pipe(gulp.dest('build-web/'))
      .pipe(connect.reload())
      .pipe(using())
  )
})


gulp.task("default", ["scripts", "definitions", "rollup"], function () {
  gulp.watch("src/**/*.ts", ["scripts", "definitions"])
  gulp.watch("example/**/*.{ts,tsx}", ["example:scripts"])
  gulp.watch("example/**/*.html", ["example:html"])
  gulp.watch("build/**/*.js", ["rollup", "example:rollup"])
  gulp.watch("build/example/ExampleApp.node.js", ["example:webpack"])
  gulp.watch("dist/offside-app-container.node.js", ["example:webpack"])

  gulp.start(["example:scripts", "example:rollup"])

  connect.server({
    root: "build-web",
    livereload: true,
  })
})

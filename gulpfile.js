var gulp = require("gulp");
var using = require("gulp-using");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

gulp.task("scripts", function () {
    return tsProject.src()
        .pipe(ts(tsProject, undefined, ts.reporter.fullReporter()))
        .js.pipe(gulp.dest("build"))
        .pipe(using());
});

gulp.task("watch", ["scripts"], function () {
  gulp.watch("src/**/*.ts", ["scripts"]);
});

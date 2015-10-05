var gulp = require('gulp'),
    livereload = require('gulp-livereload');

gulp.task('watch', function () {
	livereload.listen();
    // app/**/*.*的意思是 app文件夹下的 任何文件夹 的 任何文件
    gulp.watch(['views/*.*','public/stylesheets/*.css'], function (file) {
    	console.log("4444444");
        livereload.changed(file.path);
    });
});
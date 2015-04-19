var gulp = require('gulp'), //
    concat = require('gulp-concat'), //
    uglify = require('gulp-uglify');

gulp.task('default', function () {
    return gulp.src('src/stickUp.js')
        .pipe(uglify())
        .pipe(concat('stickUp.min.js'))
        .pipe(gulp.dest('build/js/'));
});

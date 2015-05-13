var gulp = require('gulp'), 
    concat = require('gulp-concat'), 
    uglify = require('gulp-uglify'),
    stripDebug = require('gulp-strip-debug');

gulp.task('js', function () {
    return gulp.src('src/stickUp.js')
        .pipe(stripDebug())
        .pipe(gulp.dest('build/js/'))
        .pipe(uglify())
        .pipe(concat('stickUp.min.js'))
        .pipe(gulp.dest('build/js/'));
});


// Watch
gulp.task('watch', function() {
        // Watch .scss files
        gulp.watch('src/**/*.js', ['js']);      
});

// Default task
gulp.task('default', ['js', 'watch'], function() {

});
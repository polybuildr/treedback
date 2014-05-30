// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var jscs = require('gulp-jscs');
var minifyCSS = require('gulp-minify-css');

// Lint Task
gulp.task('lint', function() {
    return gulp.src('js/*.js')
        .pipe(jscs())
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

//Minify CSS
gulp.task('css', function() {
    return gulp.src('css/*.css')
        .pipe(minifyCSS())
        .pipe(gulp.dest('styles/'));
});

/*
// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('css'));
});
*/

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('scripts'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('scripts'));
});

// Default Task
gulp.task('default', ['lint', 'scripts', 'css']);

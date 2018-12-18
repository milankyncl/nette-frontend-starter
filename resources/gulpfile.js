var gulp = require('gulp');
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var imagemin = require('gulp-imagemin');
var newer = require('gulp-newer');
var browserSync = require('browser-sync').create();
var include = require('gulp-include');

/**
 *
 */

gulp.task('_watch', function () {

    gulp.watch('assets/scss/**/*.scss', ['_process_scss']);
    gulp.watch('assets/js/**/*.js', ['_process_javascript']);
    gulp.watch('assets/img/**', ['_process_image']);

});

gulp.task('_browser-sync-static', function () {

    browserSync.init({
        server: {
            baseDir: "../www/"
        }
    });

    gulp.watch("../www/*.html").on("change", browserSync.reload);
    gulp.watch("../www/assets/css/style.min.css").on("change", browserSync.reload);
    gulp.watch("../www/assets/js/script.min.js").on("change", browserSync.reload);
    gulp.watch("../www/assets/img/*").on("change", browserSync.reload);

});

gulp.task('default', [ '_watch', '_browser-sync-php' ], function () {

    gulp.watch("../app/**/*").on("change", browserSync.reload);
    gulp.watch("../www/assets/css/style.min.css").on("change", browserSync.reload);
    gulp.watch("../www/assets/js/script.min.js").on("change", browserSync.reload);
    gulp.watch("../www/assets/img/*").on("change", browserSync.reload);

});

gulp.task('frontend', [ '_watch', '_browser-sync-static' ], function () {

    gulp.watch("../app/**/*").on("change", browserSync.reload);
    gulp.watch("../www/assets/css/style.min.css").on("change", browserSync.reload);
    gulp.watch("../www/assets/js/script.min.js").on("change", browserSync.reload);
    gulp.watch("../www/assets/img/*").on("change", browserSync.reload);

});

gulp.task('_process_scss', function () {

    var plugins = [
        autoprefixer({browsers: ['last 5 version']}),
        cssnano()
    ];

    return gulp.src([ './assets/scss/style.scss' ])
        .on('error', onError)
        .pipe(sass({
            includePaths: ['./node_modules']
        }))
        .on('error', onError)
        .pipe(postcss(plugins))
        .on('error', onError)
        .pipe(cssmin())
        .on('error', onError)
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('../www/assets/css'));
});



gulp.task('_process_javascript', function () {

    return gulp.src([ './assets/js/vendor.js', './assets/js/script.js' ])
        .pipe(concat('script.js'))
        .on('error', onError)
        .pipe(include({
            extensions: 'js',
            hardFail: true,
            includePaths: [
                './node_modules'
            ]
        }))
        .on('error', onError)
        .pipe(minify({
            ext: {
                min: '.min.js'
            }
        }))
        .on('error', onError)
        .pipe(gulp.dest('../www/assets/js/'));
});

gulp.task('_process_image', function () {

    return gulp.src('./assets/img/*')
        .pipe(newer('../www/assets/img'))
        .pipe(imagemin())
        .on('error', onError)
        .pipe(gulp.dest('../www/assets/img'));
});


function onError(err) {

    console.log(err);

    this.emit('end');
}

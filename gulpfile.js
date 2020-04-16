'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    fileinclude = require('gulp-file-include'),
    cssmin = require('gulp-minify-css'),
    svgSprite = require("gulp-svg-sprite"),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/images/',
        svg: 'build/images/svg',
        fonts: 'build/fonts/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/*.js',
        style: 'src/css/style.scss',
        img: 'src/images/**/*.*',
        svg: 'src/images/svg/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/css/**/*.scss',
        img: 'src/images/**/*.*',
        svg: 'src/images/svg/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: "Ivan"
};

gulp.task('html:build', function () {
    return gulp.src(path.src.html)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    return   gulp.src(path.src.js) //Найдем наш main файл
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(reload({stream: true})); //И перезагрузим сервер
});

gulp.task('style:build', function () {
    return gulp.src(path.src.style)
        .pipe(sass())
        .pipe(cssmin())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    return  gulp.src(path.src.img) //Выберем наши картинки
        .pipe(gulp.dest(path.build.img)) //И бросим в build
        .pipe(reload({stream: true}));
});


gulp.task('svgSprite', function () {
    return gulp.src(path.src.svg) // svg files for sprite
        .pipe(svgSprite({
                mode: {
                    stack: {
                        sprite: "../sprite.svg"  //sprite file name
                    }
                },
            }
        ))
        .pipe(gulp.dest(path.build.svg)) //И бросим в build
        .pipe(reload({stream: true}));
});

gulp.task('build',
    gulp.series(['html:build',
        'style:build',
        'js:build',
        'image:build',
        'svgSprite']));

gulp.task('watch', function(){
    gulp.watch('src/**/*.html').on('change', browserSync.reload);
    browserSync.init({
        files: gulp.parallel('src/index.html'),
        server:{
            baseDir:'./build',
            directory: true
        }
    });

    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('images:build');
    });
    watch([path.watch.svg], function(event, cb) {
        gulp.start('svgSprite');
    });
});

gulp.task('webserver', function () {
    browserSync(config);
});


gulp.task('default', gulp.series(['build', 'webserver', 'watch']));
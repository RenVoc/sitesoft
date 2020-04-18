'use strict';

var gulp = require('gulp'),
    babel = require('gulp-babel'),
    cleanCSS = require('gulp-clean-css'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    pug = require('gulp-pug'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    cssmin = require('gulp-minify-css'),
    svgSprite = require("gulp-svg-sprite"),
    browserSync = require("browser-sync"),
    reload = browserSync.reload,
    minify = require('gulp-minify'),
    include = require('gulp-include'),
    autoprefixer = require('gulp-autoprefixer');

var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        jsLibs: 'build/js/libs',
        css: 'build/css/',
        cssLibs: 'build/css/libs',
        img: 'build/images/',
        svg: 'build/images/svg',
        fonts: 'build/fonts/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/main.js',
        jsLibs: 'src/js/libs/*.js',
        style: 'src/css/style.scss',
        styleLibs: 'src/css/css.libs.scss',
        mainMobile: 'src/css/mobile.scss',
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
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    return   gulp.src(path.src.js)
        .pipe(include())
        .on('error', console.log)
        .pipe(babel())
        .pipe(minify())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('jsLibs', function () {
    return   gulp.src(path.src.jsLibs)
        .pipe(gulp.dest(path.build.jsLibs))
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
    return gulp.src(path.src.style)
        .pipe(sass())
        .pipe(cssmin())
        .pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('styleLibs', function () {
    return gulp.src(path.src.styleLibs)
        .pipe(cssmin())
        .pipe(gulp.dest(path.build.cssLibs))
        .pipe(reload({stream: true}));
});

gulp.task('mainMobile', function () {
    return gulp.src(path.src.mainMobile)
        .pipe(cssmin())
        .pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('cleanCSSBuild', () => {
    return gulp.src(path.build.css)
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(path.build.css))
});

gulp.task('pug', function () {
    return  gulp.src(['./**/*.pug', '!./node_modules/**'])
        .pipe(pug({pretty: '\t'}))
        .pipe(gulp.dest('./'))
});

gulp.task('image:build', function () {
    return  gulp.src(path.src.img)
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});


gulp.task('svgSprite', function () {
    return gulp.src(path.src.svg)
        .pipe(svgSprite({
                mode: {
                    stack: {
                        sprite: "../sprite.svg"
                    }
                },
            }
        ))
        .pipe(gulp.dest(path.build.svg))
        .pipe(reload({stream: true}));
});


gulp.task('build',
    gulp.series('html:build',
        'pug',
        'styleLibs',
        'style:build',
        'mainMobile',
        'cleanCSSBuild',
        'jsLibs',
        'js:build',
        'image:build',
        'svgSprite'));

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

gulp.task('default', gulp.series('build', 'pug', 'html:build', 'styleLibs', 'style:build', 'mainMobile', 'webserver', 'watch', 'js:build', 'jsLibs', 'image:build'));
'use strict';

var gulp = require('gulp'),
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
    autoprefixer = require('gulp-autoprefixer');

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
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    return   gulp.src(path.src.js) //Найдем наш main файл
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(reload({stream: true})); //И перезагрузим сервер
});

gulp.task('style:build', function () {
    return gulp.src(path.src.style)
        .pipe(sass())
        .pipe(cssmin())
        .pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
        .pipe(cleanCSS({compatibility: 'ie8'}))
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
    return  gulp.src(path.src.img) //Выберем наши картинки
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
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
    gulp.parallel('html:build',
        'style:build',
        'pug',
        'js:build',
        'image:build',
        'svgSprite'));

gulp.task('watch', function(){
    gulp.watch('src/**/*.html').on('change', browserSync.reload);
    browserSync.init({
        files: gulp.parallel('src/index.pug'),
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


gulp.task('default', gulp.series('build', 'webserver', 'watch', 'style:build', 'pug', 'js:build', 'image:build', 'svgSprite'));
// Node modules
var fs = require('fs'),
    vm = require('vm'),
    merge = require('deeply'),
    chalk = require('chalk'),
    es = require('event-stream');

// Gulp and plugins
var gulp = require('gulp'),
    rjs = require('gulp-requirejs-bundler'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    replace = require('gulp-replace'),
    uglify = require('gulp-uglify'),
    htmlreplace = require('gulp-html-replace'),
    typescript = require('gulp-tsc'),
    webServer = require('gulp-webserver'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    gulpsync = require('gulp-sync')(gulp),
    cssbeautify = require('gulp-cssbeautify');

// WebServer
gulp.task('webserver', ['auto-ts', 'auto-sass'], function() {
    var config;
    try {
        config = require('./config');
        gutil.log('load configuration file');
    } catch(e) {
        config = {
            "server": "http://localhost:8888"
        };
        gutil.log('using default configuration: ', config);
    }

    gulp.src('./src')
        .pipe(webServer({
            host: '0.0.0.0',
            fallback: 'index.html',
            livereload: {
                enable: true,
                port: 8001
            },
            directoryListing: true,
            port: 1314,
            proxies: [
                {
                    source: '/localmd',
                    target: config.server
                }
            ]
        }));
});

var requireJsRuntimeConfig = vm.runInNewContext(fs.readFileSync('src/app/require.config.js') + '; require;');
requireJsOptimizerConfig = merge(requireJsRuntimeConfig, {
    out: 'scripts.js',
    baseUrl: './src',
    name: 'app/startup',
    paths: {
        requireLib: 'bower_modules/requirejs/require'
    },
    include: [
        'requireLib',
        'components/nav-bar/nav-bar',
        'components/home-page/home',
        'text!components/about-page/about.html'
    ],
    insertRequire: ['app/startup'],
    bundles: {}
});

// Compile all .ts files, producing .js and source map files alongside them
gulp.task('ts', function() {
    return gulp.src(['**/*.ts'])
        .pipe(typescript({
            module: 'amd',
            sourcemap: false,
            outDir: './',
            target: 'es5',
            emitError: false
        }))
        .pipe(gulp.dest('./'));
});
gulp.task('auto-ts', ['ts'], function() {
    gulp.watch('**/*.ts', {
        ignored: '.gulp-tsc-tmp*.ts'
    }, function() {
        gulp.src(['**/*.ts'])
            .pipe(typescript({
                module: 'amd',
                sourcemap: false,
                outDir: './',
                target: 'es5',
                emitError: false
            }))
            .on('error', gutil.log)
            .pipe(gulp.dest('./'));
    });
});

// Discovers all AMD dependencies, concatenates together all required .js files, minifies them
gulp.task('js', ['ts'], function() {
    return rjs(requireJsOptimizerConfig)
        .pipe(uglify({
            preserveComments: 'some'
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('auto-sass', ['sass'], function() {
    gulp.watch('./src/css/*.scss', ['sass']);
});
gulp.task('sass', function() {
    return gulp.src('./src/css/*.scss')
        .pipe(
            sass({

            }).on('error', sass.logError)
        )
        .pipe(cssbeautify())
        .pipe(gulp.dest('./src/css'));
});
// Concatenates CSS files, rewrites relative paths to Bootstrap fonts, copies Bootstrap fonts
gulp.task('css', ['sass'], function() {
    var bowerCss = gulp.src('src/bower_modules/components-bootstrap/css/bootstrap.min.css')
        .pipe(replace(/url\((')?\.\.\/fonts\//g, 'url($1fonts/')),
        appCss = gulp.src('src/css/*.css'),
        combinedCss = es.concat(bowerCss, appCss).pipe(concat('css.css')),
        fontFiles = gulp.src('./src/bower_modules/components-bootstrap/fonts/!*', {
            base: './src/bower_modules/components-bootstrap/'
        });
    return es.concat(combinedCss, fontFiles)
        .pipe(gulp.dest('./dist/'));
});
// Copies index.html, replacing <script> and <link> tags to reference production URLs
gulp.task('html', function() {
    return gulp.src('./src/index.html')
        .pipe(htmlreplace({
            'css': 'css.css',
            'js': 'scripts.js'
        }))
        .pipe(gulp.dest('./dist/'));
});

// Removes all files from ./dist/, and the .js/.js.map files compiled from .ts
gulp.task('clean', function() {
    var distContents = gulp.src('./dist/**/*', {
            read: false
        }),
        generatedJs = gulp.src(['src/**/*.js', 'src/**/*.js.map', 'test/**/*.js', 'test/**/*.js.map', '**/.DS_Store', 'src/css/*.css'], {
            read: false
        })
        .pipe(es.mapSync(function(data) {
            return fs.existsSync(data.path.replace(/\.js(\.map)?$/, '.ts')) ? data : undefined;
        }));
    return es.merge(distContents, generatedJs).pipe(clean());
});

gulp.task('default', gulpsync.sync['html', 'js', 'css'], function(callback) {
    callback();
    console.log('\nPlaced optimized files in ' + chalk.magenta('dist/\n'));
});

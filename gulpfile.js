#!/usr/bin/env node

'use strict';

var version = require('./lib/version.json');
var path = require('path');

var del = require('del');
var gulp = require('gulp');
var browserify = require('browserify');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var exorcist = require('exorcist');
var bower = require('bower');
var streamify = require('gulp-streamify');
var replace = require('gulp-replace');

var DEST = path.join(__dirname, 'dist/');
var src = 'index';
var dst = 'chain3';
var lightDst = 'chain3-light';

var browserifyOptions = {
    debug: true,
    insert_global_vars: false, // jshint ignore:line
    detectGlobals: false,
    bundleExternal: true
};

gulp.task('version', function(){
  gulp.src(['./package.json'])
    .pipe(replace(/\"version\"\: \"([\.0-9]*)\"/, '"version": "'+ version.version + '"'))
    .pipe(gulp.dest('./'));
  gulp.src(['./bower.json'])
    .pipe(replace(/\"version\"\: \"([\.0-9]*)\"/, '"version": "'+ version.version + '"'))
    .pipe(gulp.dest('./'));
  gulp.src(['./package.js'])
    .pipe(replace(/version\: \'([\.0-9]*)\'/, "version: '"+ version.version + "'"))
    .pipe(gulp.dest('./'));
});

gulp.task('bower', ['version'], function(cb){
    bower.commands.install().on('end', function (installed){
        console.log(installed);
        cb();
    });
});

gulp.task('lint', [], function(){
    return gulp.src(['./*.js', './lib/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


gulp.task('clean', ['lint'], function(cb) {
    del([ DEST ]).then(cb.bind(null, null));
});

//build the light version of the chain3 library used for browser
gulp.task('light', ['clean'], function () {
    return browserify(browserifyOptions)
        .require('./' + src + '.js', {expose: 'chain3'})
        .ignore('bignumber.js')
        .require('./lib/utils/browser-bn.js', {expose: 'bignumber.js'}) // fake bignumber.js
        .add('./' + src + '.js')
        .bundle()
        .pipe(exorcist(path.join( DEST, lightDst + '.js.map')))
        .pipe(source(lightDst + '.js'))
        .pipe(gulp.dest( DEST ))
        .pipe(streamify(uglify()))
        .pipe(rename(lightDst + '.min.js'))
        .pipe(gulp.dest( DEST ));
});

/*build the chain3.js under dist using files listed in the [lint] option*/
gulp.task('standalone', ['clean'], function () {
    return browserify(browserifyOptions)
        .require('./' + src + '.js', {expose: 'chain3'})
        .require('bignumber.js') // expose it to dapp users
        .add('./' + src + '.js')
        .ignore('crypto')
        .bundle()
        .pipe(exorcist(path.join( DEST, dst + '.js.map')))
        .pipe(source(dst + '.js'))
        .pipe(gulp.dest( DEST ))
        .pipe(streamify(uglify()))
        .pipe(rename(dst + '.min.js'))
        .pipe(gulp.dest( DEST ));
});

gulp.task('chain3', ['clean'], function () {
    return browserify(browserifyOptions)
        .require('./' + src + '.js', {expose: 'chain3'})
        .require('bignumber.js') // expose it to dapp users
        .add('./' + src + '.js')
        .ignore('crypto')
        .bundle()
        .pipe(exorcist(path.join( DEST, dst + '.js.map')))
        .pipe(source(dst + '.js'))
        .pipe(gulp.dest( DEST ))
        .pipe(streamify(uglify()))
        .pipe(rename(dst + '.min.js'))
        .pipe(gulp.dest( DEST ));
});

gulp.task('watch', function() {
    gulp.watch(['./lib/*.js'], ['lint', 'build']);
});

/*Default build process*/
gulp.task('default', ['version', 'lint', 'clean', 'light', 'standalone']);


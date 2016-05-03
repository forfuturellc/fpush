/**
 * The MIT License (MIT)
 * Copyright (c) 2016 GochoMugo <mugo@forfuture.co.ke>
 * Copyright (c) 2016 Forfuture, LLC < we@forfuture.co.ke>
 *
 * Stage: determine state of local machine
 * Actions:
 * - read all files in the directory
 */


// built-in modules
const fs = require('fs');
const path = require('path');


// npm-installed modules
const async = require('async');
const debug = require('debug')('ftpush:stages:local-state');


exports = module.exports = function localState(globals, state, next) {
    var fileBuffers = {};

    // read files in the directory
    return fs.readdir(state.localdir.path, function(readdirErr, files) {
        if (readdirErr) {
            debug('error reading directory "%s": %s', state.localdir.path, readdirErr);
            return next(readdirErr);
        }

        // special case: files is empty
        if (files.length === 0) return next();

        var readFiles = 0;
        var readErrs = [];

        function finish() {
            // if we have read all files, we are done
            if (readFiles === files.length) {
                if (readErrs.length !== 0) {
                    var err = new Error('one or more files could not be read');
                    err.inner_errors = readErrs;
                    return next(err);
                }
                state.localdir.buffers = fileBuffers;
                return next(null);
            }
        }

        files.forEach(function(filename) {
            // always ignore the configuration file
            if (filename === globals.options.configfileName) {
                readFiles++;
                return finish();
            }

            var filepath = path.join(state.localdir.path, filename);
            return async.waterfall([
                // stat the file
                async.apply(function(filepath, done) {
                    fs.stat(filepath, function(statErr, stats) {
                        return done(statErr, filepath, stats);
                    });
                }, filepath),
                // read the file, if it is a regular file
                function(filepath, stats, done) {
                    if (!stats.isFile()) {
                        return done(null);
                    }
                    fs.readFile(filepath, function(readFileErr, fileBuffer) {
                        if (readFileErr) {
                            return done(readFileErr);
                        }
                        fileBuffers[path.basename(filepath)] = fileBuffer;
                        return done(null);
                    });
                },
            ], function(err) {
                readFiles++;
                if (err) {
                    debug('error stating/reading a local file: %s', err);
                    readErrs.push(err);
                }
                return finish();
            });
        });
    });
};

/**
 * The MIT License (MIT)
 * Copyright (c) 2016 GochoMugo <mugo@forfuture.co.ke>
 * Copyright (c) 2016 Forfuture, LLC < we@forfuture.co.ke>
 *
 * Stage: update remote
 * Actions:
 * - push files
 * - delete files
 * - update filelist
 */


// built-in modules
const path = require('path');


// npm-installed modules
const async = require('async');


// own modules
const filelist = require('../filelist');


exports = module.exports = function update(globals, state, next) {
    // push the changed files
    function push(actionDone) {
        async.each(state.diffs.changed, function(filename, done) {
            var filepath = path.join(state.remotedir.path, filename);
            globals.ftp.put(state.localdir.buffers[filename], filepath, done);
        }, actionDone);
    }

    // delete the deleted files
    function del(actionDone) {
        async.each(state.diffs.deleted, function(filename, done) {
            var filepath = path.join(state.remotedir.path, filename);
            globals.ftp.raw.dele(filepath, done);
        }, actionDone);
    }

    async.parallel([
        push,
        del,
    ], function(actionErr) {
        if (actionErr) {
            return next(actionErr);
        }
        // push an updated filelist
        var buffer = filelist.toBuffer(state.diffs.filelist);
        globals.ftp.put(buffer, state.remotedir.filelistpath, function(putErr) {
            return next(putErr);
        });
    });
};

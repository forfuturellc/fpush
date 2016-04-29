/**
 * The MIT License (MIT)
 * Copyright (c) 2016 GochoMugo <mugo@forfuture.co.ke>
 * Copyright (c) 2016 Forfuture, LLC < we@forfuture.co.ke>
 *
 * Stages.
 */


exports = module.exports = {
    run: run,
};


// built-in modules
const path = require('path');


// npm-installed modules
const async = require('async');
const debug = require('debug')('ftpush:stages:index');


// own modules
const stageRemoteState = require('./remote-state');
const stageLocalState = require('./local-state');
const stageDiffs = require('./diffs');
const stageUpdate = require('./update');


/**
 * Runs the stages, in series.
 *
 * @param {Object} globals - global variables
 * @param {String} dirpath - path of dir being worked on; relative to sourceDir
 * @param {Function} done - callback
 */
function run(globals, dirpath, done) {
    var state = {
        remotedir: {
            path: path.join(globals.options.remoteDir, dirpath),
            filelistpath: path.join(globals.options.remoteDir, dirpath, globals.options.filelistName),
            contents: [],
        },
        filelist: {},
        localdir: {
            path: path.join(globals.options.sourceDir, dirpath),
            buffers: {},
        },
        diffs: {
            changed: [],
            deleted: [],
            filelist: {},
        },
    };
    return async.series([
        wrapStage(stageRemoteState, globals, state),
        wrapStage(stageLocalState, globals, state),
        wrapStage(stageDiffs, globals, state),
        wrapStage(stageUpdate, globals, state),
    ], function(stageErr) {
        return done(stageErr);
    });
}


function wrapStage(stage, globals, state) {
    return function(done) {
        debug('invoking stage \'%s\' with state: %j', stage.name, state);
        stage(globals, state, done);
    };
}

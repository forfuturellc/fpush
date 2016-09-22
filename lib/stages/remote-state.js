/**
 * The MIT License (MIT)
 * Copyright (c) 2016 GochoMugo <mugo@forfuture.co.ke>
 * Copyright (c) 2016 Forfuture, LLC <we@forfuture.co.ke>
 *
 * Stage: determine state of remote server
 * Actions:
 * - retrieve file listing of remote directory
 * - retrieve filelist from remote server
 */


// npm-installed modules
const async = require('async');
const debug = require('debug')('ftpush:stages:remote-state');


// own modules
const constants = require('../constants');
const filelist = require('../filelist');


exports = module.exports = function remoteState(globals, state, next) {
    return async.series([
        // create the remote directory
        // we prefer just firing this request to create directory, rather
        // than checking first then creating if non-existent
        function(done) {
            return state.driver.mkdir(state.remotedir.path, function(mkdirError) {
                if (mkdirError) {
                    debug('error creating remote directory: %s', mkdirError);
                    return done(mkdirError);
                }
                return done(null);
            });
        },
        // retrieving listing of the remote directory
        function(done) {
            return state.driver.ls(state.remotedir.path, function(lsError, filenames) {
                if (lsError) {
                    debug('error listing contents of remote dir: %s', lsError);
                    return done(lsError);
                }
                state.remotedir.filenames = filenames;
                return done(null);
            });
        },
        // retrieving filelist, if available
        function(done) {
            // check if the filelist is available
            var found = state.remotedir.filenames.find(function(filename) {
                return filename === globals.options.filelistName;
            });
            if (!found) return done(null);

            return state.driver.get(state.remotedir.filelistpath, function(getError, buffer) {
                if (getError) {
                    debug('error retrieving file-list: %s', getError);
                    return done(getError);
                }
                let list;
                // try parse the filelist
                try {
                    state.remotedir.filelist = filelist.parse(buffer);
                } catch(parseError) {
                    debug('error parsing file-list: %s', parseError);
                    return done(parseError);
                }
                return done(null);
            });
        },
    ], next);
};


// code (constant) dedicated for this stage
exports.stageCode = constants.stage.remoteState;

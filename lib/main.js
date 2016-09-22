/**
 * The MIT License (MIT)
 * Copyright (c) 2016 GochoMugo <mugo@forfuture.co.ke>
 * Copyright (c) 2016 Forfuture, LLC <we@forfuture.co.ke>
 *
 * Program's main entry point
 */


exports = module.exports = main;


// built-in modules
const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');


// npm-installed modules
const _ = require('lodash');
const walker = require('walker');
const out = require('cli-output');


// own modules
const constants = require('./constants');
const defaults = require('./defaults');
const stages = require('./stages');
const parallel = require('./parallel');


function main(options) {
    // our global variables
    const globals = {
        emitter: new EventEmitter(),
        pendingRuns: 0,
        doneWalking: false,
        options: {},
    };

    // if a reporter has been provided, pass the emitter to it
    if (_.isFunction(options.reporter)) options.reporter(globals.emitter);

    // load configuration from the respective '.ftpush.toml'
    const configFilename = options.configFilename || defaults.configFilename;
    const configPath = options.configPath || path.join(process.cwd(), configFilename);
    const profile = options.profile || defaults.profile;
    let allConfig = {};
    try {
        allConfig = require(configPath);
        globals.emitter.emit('Info', `using configuration file at '${configPath}'`);
    } catch(requireErr) {
        // continue if config file is missing. Just log that.
        if (requireErr.message.indexOf('Cannot find module') !== -1) {
            globals.emitter.emit('Info', 'Configuration file is missing. Continuing...');
            requireErr = null;
        }
        if (requireErr) {
            process.nextTick(function() {
                globals.emitter.emit('ConfigError', requireErr);
            });
            return globals.emitter;
        }
    }
    const config = allConfig[profile] || {};

    // Load all options, in order of increasing precedence:
    // defaults, options from config file, options from command-line args
    globals.options = _.defaultsDeep({
        configFilename,
        configPath,
        profile,
    }, options, config, defaults);

    // ensure sourceDir is absolute
    globals.options.sourceDir = path.isAbsolute(globals.options.sourceDir) ?
        globals.options.sourceDir :
        path.join(process.cwd(), globals.options.sourceDir);

    // printing the configurations
    globals.emitter.emit('Info', 'Printing configuration values being used:');
    const pass = globals.options.ftp.pass;
    globals.emitter.emit('Config', _.defaultsDeep({
        ftp: {
            // we do NOT display the password, as it may leak through logs
            pass: pass ? Array(pass.length + 1).join('*') : null,
        },
    }, globals.options));

    // we require a FTP host
    if (!globals.options.ftp.host) {
        globals.emitter.emit('ConfigError', new Error('FTP host missing'));
        return globals.emitter;
    }

    // create a new handler for parallel runs
    globals.parallel = new parallel.Handler(globals, function(ftp, dirpath, next) {
        return stages.run(globals, { ftp, dirpath }, function(err) {
            globals.pendingRuns--;
            globals.emitter.emit('DirDone', err, dirpath, {
                status: err ? constants.status.error : constants.status.done,
                constants,
            });

            // if we are stop on error, we forcibly exit
            if (globals.options.stopOnError && err) {
                finish(true);
                return;
            }

            return next();
        });
    }, finish);

    // walking through the source directory
    walker(globals.options.sourceDir)
        .filterDir(function(dirpath) {
            var basename = path.basename(dirpath);
            // return false, to skip
            return globals.options.ignoreDirs.indexOf(basename) === -1;
        })
        .on('dir', function(dirpath) {
            globals.pendingRuns++;
            dirpath = path.relative(globals.options.sourceDir, dirpath) || ".";
            globals.emitter.emit('DirInfo', dirpath, {
                status: constants.status.queued,
                constants,
            });
            globals.parallel.enqueue(dirpath);
        })
        .on('error', function(err) {
            return globals.emitter.emit('WalkerError', err);
        })
        .on('end', function() {
            globals.doneWalking = true;
            return finish();
        })
        ;

    // check to see if we are done
    function finish(force) {
        if (!force && (globals.doneWalking === false || globals.pendingRuns !== 0)) {
            return;
        }
        // workaround: See issue #6
        return globals.parallel.destroyFtps(function(destroyErr) {
            return globals.emitter.emit('Exit', destroyErr);
        });
    }

    // return the emitter
    return globals.emitter;
}

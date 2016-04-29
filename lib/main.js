/**
 * The MIT License (MIT)
 * Copyright (c) 2016 GochoMugo <mugo@forfuture.co.ke>
 * Copyright (c) 2016 Forfuture, LLC < we@forfuture.co.ke>
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
const Ftp = require('jsftp');
const out = require('cli-output');


// own modules
const defaults = require('./defaults');
const stages = require('./stages');


function main(options) {
    // our global variables
    var globals = {
        ftp: null,
        emitter: null,
        pendingRuns: 0,
        doneWalking: false,
        options: {},
    }

    // ensure sourceDir is absolute
    var sourceDir = options.sourceDir || defaults.sourceDir;
    sourceDir = path.isAbsolute(sourceDir) ? sourceDir : path.join(process.cwd(), sourceDir);

    // load configuration from the respective '.ftpush.toml'
    var configPath = options.configPath || path.join(sourceDir, defaults.configfileName);
    var profile = options.profile || defaults.profile;
    var allConfig = {};
    try {
        allConfig = require(configPath);
        out.info(`using configuration file at '${configPath}'`);
    } catch(requireErr) {
        // continue if config file is missing. Just log that.
        if (requireErr.message.indexOf('Cannot find module') !== -1) {
            out.info('Configuration file is missing. Continuing...');
            requireErr = null;
        }
        if (requireErr) {
            out.error(`error loading configuration file: ${requireErr}`);
            process.exit(1);
        }
    }
    const config = allConfig[profile] || {};

    // Load all options, in order of increasing precedence:
    // defaults, options from config file, options from command-line args
    globals.options = _.defaultsDeep({
        // we prefer an absolute path
        sourceDir: sourceDir,
    }, options, config, defaults);

    // printing the FTP configurations files
    out.info('Printing configuration values being used:');
    const pass = globals.options.ftp.pass;
    out.pjson(_.defaultsDeep({
        ftp: {
            // we do NOT display the password, as it may leak through logs
            pass: pass ? Array(pass.length + 1).join('*') : null,
        },
    }, globals.options));

    // we require a FTP host
    if (!globals.options.ftp.host) {
        out.error(`FTP host missing`);
        process.exit(1);
    }

    // we create an event emitter
    globals.emitter = new EventEmitter();

    // we create a FTP client
    globals.ftp = new Ftp(globals.options.ftp);

    // listen for FTP errors
    globals.ftp.on('error', function(err) {
        globals.emitter.emit('FTPError', err);
    });

    // walking through the source directory
    walker(globals.options.sourceDir)
        .filterDir(function(dirpath) {
            var basename = path.basename(dirpath);
            // return false, to skip
            return globals.options.ignoreDirs.indexOf(basename) === -1;
        })
        .on('dir', function(dirpath) {
            globals.pendingRuns++;
            dirpath = path.relative(globals.options.sourceDir, dirpath);
            return stages.run(globals, dirpath, function(err) {
                globals.pendingRuns--;
                globals.emitter.emit('DirDone', err, dirpath || '.');
                return finish();
            });
        }).on('error', function(err) {
            return globals.emitter.emit('WalkerError', err);
        }).on('end', function() {
            globals.doneWalking = true;
            return finish();
        });

    // check to see if we are done
    function finish() {
        if (globals.doneWalking === false || globals.pendingRuns !== 0) {
            return;
        }
        return globals.ftp.raw.quit(function(quitErr) {
            globals.emitter.emit('Exit', quitErr);
        });
    }

    // return the emitter
    return globals.emitter;
}

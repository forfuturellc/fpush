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
const DriverInterface = require('./drivers/interface');


function main(options) {
    // our global variables
    const globals = {
        emitter: new EventEmitter(),
        pendingRuns: 0,
        doneWalking: false,
        options: {},
        Driver: null,
        driverConfig: null,
    };
    const lateEmit = function(...args) {
        return process.nextTick(function() {
            return globals.emitter.emit(...args);
        });
    };

    // load configuration from the respective '.fpush.toml'
    const configFilename = options.configFilename || defaults.configFilename;
    const configPath = options.configPath || path.join(process.cwd(), configFilename);
    const profile = options.profile || defaults.profile;
    let allConfig = {};
    try {
        allConfig = require(configPath);
        lateEmit('Info', `using configuration file at '${configPath}'`);
    } catch(requireErr) {
        // continue if config file is missing. Just log that.
        if (requireErr.message.indexOf('Cannot find module') !== -1) {
            lateEmit('Info', 'Configuration file is missing. Continuing...');
            requireErr = null;
        }
        if (requireErr) {
            lateEmit('ConfigError', requireErr);
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

    // load the reporter
    if (_.isFunction(globals.options.reporter)) {
        globals.options.reporter(globals.emitter);
    } else {
        let reporterRequireKey = globals.options.reporter;
        let reporter;
        if (!globals.options.dynamicReporter) {
            reporterRequireKey = path.join(__dirname, 'reporters', reporterRequireKey);
        }
        try {
            reporter = require(reporterRequireKey);
        } catch (ex) {
            const error = new Error('Reporter for \'' + globals.options.reporter + '\' is missing');
            error.code = 'ENOREPORTER';
            lateEmit('ReporterError', error);
            return globals.emitter;
        }
        reporter(globals.emitter);
    }

    // we do NOT provide the password to reporters, as they may,
    // intentionally or not, leak it through logs
    const hidePass = function(obj) {
        return {
            pass: obj.pass ? Array(obj.pass.length + 1).join('*') : null,
        };
    }
    const publicConfig = _.defaultsDeep({
        ftp: hidePass(globals.options.ftp),
    }, globals.options);
    // remove the reporter property, as it is useless since a function is
    // passed, not a string. Also, how the reporter displays the results
    // is proof enough of it being used.
    delete publicConfig.reporter;
    lateEmit('Config', publicConfig);

    // load the driver
    if (globals.options.driver instanceof DriverInterface.Driver) {
        globals.Driver = globals.options.driver;
    } else {
        let driverRequireKey = globals.options.driver;
        let driver;
        if (!globals.options.dynamicDriver) {
            driverRequireKey = path.join(__dirname, 'drivers', driverRequireKey);
        }
        try {
            driver = require(driverRequireKey);
        } catch (ex) {
            const error = new Error('Driver for \'' + globals.options.driver + '\' is missing');
            error.code = 'ENODRIVER';
            lateEmit('DriverError', error);
            return globals.emitter;
        }
        globals.Driver = driver.Driver;
    }

    globals.driverConfig = globals.options[driver];
    try {
        globals.Driver.validateConfig(globals.driverConfig);
    } catch (ex) {
        lateEmit('ConfigError', ex);
        return globals.emitter;
    }

    // create a new handler for parallel runs
    globals.parallel = new parallel.Handler(globals, function(driver, dirpath, next) {
        return stages.run(globals, { driver, dirpath }, function(err) {
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
        return globals.parallel.destruct(function(destructError) {
            return globals.emitter.emit('Exit', destructError);
        });
    }

    // return the emitter
    return globals.emitter;
}

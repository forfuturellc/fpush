/**
 * The MIT License (MIT)
 * Copyright (c) 2016 GochoMugo <mugo@forfuture.co.ke>
 * Copyright (c) 2016 Forfuture, LLC < we@forfuture.co.ke>
 *
 * Handle parallel handling of directories.
 *
 * Notes:
 * ------
 *
 * The order of the paths in executing the attached function on the handler
 * is important as we need parent directories to be created before
 * child directories are considered. The used walker enqueues directories
 * as it finds them, directories are added to the queue as the walker
 * goes deeper in the directory structure. Therefore, this queue should
 * be considered a FIFO structure.
 *
 * Implementing parallelism will require handling the paths in a tree
 * fashion, with a breadth-first manner i.e. the parent directories
 * are created first.
 * Also, we may need to use separate FTP connections to handle multiple
 * directories simultaneously. See https://github.com/forfuturellc/fpush/issues/1
 * and https://github.com/sergi/jsftp/issues/66 for more information
 * on this.
 */


// npm-installed modules
const _ = require('lodash');
const async = require('async');
const debug = require('debug')('fpush:parallel');


exports.Handler = class Handler {
    /**
     * Construct a new handler.
     *
     * @param {Object} globals
     * @param {Function} exec(dirpath, next) - executed for each directory
     * @param {Function} empty() - executed whenever the queue is empty.
     */
    constructor(globals, exec, empty) {
        this._globals = globals;
        this._hooks = {
            exec: exec,
            empty: empty,
        };
        this._drivers = [];
        this._queue = [];
        this._pending = 0;
        // why an object? Cause it is easy to use in this scenario
        this._pendingDirs = {};
    }

    destruct(done) {
        debug('closing driver connections');
        return async.each(this._drivers, function(driver, next) {
            return driver.destruct(next);
        }, done);
    }

    // Add a directory to the queue
    enqueue(dir) {
        this._queue.push(dir);
        this._next();
        return this;
    }

    // Handle the next directory, if possible
    _next() {
        if (this._queue.length === 0) {
            this._hooks.empty();
            return this;
        }
        const parallel = this._globals.options.parallel;
        if (parallel > 0 && this._pending >= parallel) return this;
        this._run();
        return this;
    }

    // Execute the associated function, for the next directory
    _run() {
        var self = this;

        // we need to find a directory that is not a child of any of the
        // pending directories
        const pendingDirs = Object.keys(this._pendingDirs);
        const dirpath = this._queue.find(function(queuedDir) {
            return pendingDirs.findIndex(function(pendingDir) {
                return queuedDir.indexOf(pendingDir) === 0;
            }) === -1;
        });

        // if we could not find a directory, we exit immediately
        // otherwise, we remove the path from the queue
        if (!dirpath) return this;
        _.pull(this._queue, dirpath);

        this._pendingDirs[dirpath] = 1;
        this._pending++;

        let driver = this._drivers.shift();

        // if there is no free driver connection, open one
        if (!driver) {
            debug('opening a new driver connection');
            driver = new this._globals.Driver(this._globals.driverConfig);
            driver.on('error', function(error) {
                self._globals.emitter.emit('DriverError', error);
            });
            driver.on('ready', goahead);
        } else {
            goahead();
        }

       function goahead() {
            self._hooks.exec(driver, dirpath, function() {
                self._drivers.push(driver);
                delete self._pendingDirs[dirpath];
                self._pending--;
                self._next();
            });
        }
        return this;
    }
}

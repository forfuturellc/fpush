/**
 * The MIT License (MIT)
 * Copyright (c) 2016 GochoMugo <mugo@forfuture.co.ke>
 * Copyright (c) 2016 Forfuture, LLC < we@forfuture.co.ke>
 *
 * Handle parallel handling of directories.
 */


exports.Handler = class Handler {
    /**
     * Construct a new handler.
     *
     * @param {Object} globals
     * @param {Function} exec(dirpath, next) - executed for each directory
     * @param {Function} empty() - executed whenever the queue is empty.
     *
     * NOTE: the `empty()` function is executed each single time, when
     * parallelism is NOT limited. This is because the directories are NOT
     * queued up.
     */
    constructor(globals, exec, empty) {
        this._globals = globals;
        this._hooks = {
            exec: exec,
            empty: empty,
        };
        this._queue = [];
        this._pending = 0;
    }

    // Add a directory to the queue
    enqueue(dir) {
        // Avoid any overhead, should we be allowed to do max
        // parallelism possible
        if (this._globals.options.parallel <= 0) {
            this._run(dir);
            return this;
        }
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
        if (this._pending >= this._globals.options.parallel) return this;
        this._run();
        return this;
    }

    // Execute the associated function, for the next directory
    _run(dirpath) {
        var self = this;
        dirpath = dirpath || this._queue.pop();
        this._pending++;
        this._hooks.exec(dirpath, function() {
            self._pending--;
            self._next();
        });
        return this;
    }
}

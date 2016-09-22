/**
 * The MIT License (MIT)
 * Copyright (c) 2016 GochoMugo <mugo@forfuture.co.ke>
 * Copyright (c) 2016 Forfuture, LLC <we@forfuture.co.ke>
 *
 * The FTP driver.
 */


// built-in modules
const EventEmitter = require('events');


// npm-installed modules
const Ftp = require('jsftp');
const concat = require('concat-stream');


exports = module.exports = class FTP extends EventEmitter {
    constructor(options) {
        super();
        this._ftp = new Ftp(options);
        this._ftp.on('error', (error) => this.emit('error', error));
        this._ftp.once('connect', () => this.emit('ready'));
    }

    destruct(done) {
        const self = this;
        this._ftp.raw.quit(function(quitError) {
            if (quitError) return done(quitError);
            // WORKAROUND: See issue #6
            self._ftp.socket.destroy();
            return done();
        });
    }

    mkdir(rpath, done) {
        this._ftp.raw.mkd(rpath, function(mkdError) {
            // ignore the error if it is due to the directory
            // existing already
            if (mkdError && mkdError.code === 550) mkdError = null;
            return done(mkdError);
        });
        return this;
    }

    ls(rpath, done) {
        this._ftp.ls(rpath, function(lsError, contents) {
            if (lsError) {
                return done(lsError);
            }
            const filenames = contents.filter(function(file) {
                return file.type === 0;
            }).map(function(file) {
                return file.name;
            });
            return done(null, filenames);
        });
        return this;
    }

    get(rpath, done) {
        this._ftp.get(rpath, function(getError, socket) {
            if (getError) {
                return done(getError);
            }
            socket.on('error', function(error) {
                return done(error);
            });
            const end = concat(function(contentBuffer) {
                return done(null, contentBuffer);
            });
            socket.pipe(end);
        });
        return this;
    }

    put(rpath, contentBuffer, done) {
        this._ftp.put(contentBuffer, rpath, done);
        return this;
    }

    del(rpath, done) {
        this._ftp.raw.dele(rpath, done);
        return this;
    }

    static validateConfig(config) {
        if (!config || !config.host) throw new Error('FTP host missing');
    }
};

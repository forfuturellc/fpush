/**
 * The MIT License (MIT)
 * Copyright (c) 2016 GochoMugo <mugo@forfuture.co.ke>
 * Copyright (c) 2016 Forfuture, LLC <we@forfuture.co.ke>
 *
 * The SFTP driver.
 */


// built-in modules
const EventEmitter = require('events');


// npm-installed modules
const concat = require('concat-stream');
const ssh = require('ssh2');


// the protocol
exports.protocol = 'sftp';


exports.Driver = class SFTP extends EventEmitter {
    constructor(options) {
        super();
        this._opts = options;
        this._connection = new ssh.Client();
        this._sftp = null;
        this._init();
    }

    _init() {
        const self = this;
        this._connection.on('error', function(error) {
            self.emit('error', error);
        }).on('ready', function() {
            self._connection.sftp(function(sftpError, sftp) {
                if (sftpError) {
                    self.emit('error', sftpError);
                }
                self._sftp = sftp;
                self.emit('ready');
            });
        }).connect({
            host: this._opts.host,
            port: this._opts.port,
            username: this._opts.user,
            password: this._opts.pass,
        });
    }

    destruct() {
        this._connection.end();
    }

    mkdir(rpath, done) {
        const self = this;
        if (rpath === '.') return done(null);
        this._sftp.stat(rpath, function(statError, stats) {
            // If an error has occurred and it is not due to
            // the directory being missing
            // TODO: use the exported status code, instead of hard-coding
            // this error code
            if (statError && statError.code !== 2) {
                return done(statError);
            }
            // if the directory already exists
            if (stats && stats.isDirectory()) {
                return done(null);
            }
            return self._sftp.mkdir(rpath, function(mkdirError) {
                return done(mkdirError);
            });
        });
        return this;
    }

    ls(rpath, done) {
        this._sftp.readdir(rpath, function(readdirError, list) {
            if (readdirError) {
                return done(readdirError);
            }
            const filenames = list.filter(function(file) {
                // file.logname ~= '-rw-r--r--    1 frylock   frylock         12 Nov 18 11:05 test.txt'
                return file.longname.trim()[0] === '-';
            }).map(function(file) {
                return file.filename;
            });
            return done(null, filenames);
        });
        return this;
    }

    get(rpath, done) {
        const rstream = this._sftp.createReadStream(rpath);
        const end = concat(function(contentBuffer) {
            return done(null, contentBuffer);
        });
        rstream.on('error', function(error) {
            return done(error);
        });
        rstream.pipe(end);
        return this;
    }

    put(rpath, contentBuffer, done) {
        const wstream = this._sftp.createWriteStream(rpath);
        wstream.on('error', function(error) {
            return done(error);
        });
        wstream.end(contentBuffer, function() {
            return done(null);
        });
        return this;
    }

    del(rpath, done) {
        this._sftp.unlink(rpath, function(unlinkError) {
            return done(unlinkError);
        });
        return this;
    }
};


exports.validateConfig = function validateConfig(config) {
    if (!config || !config.host) throw new Error('SFTP host missing');
};


exports.defaultConfig = function defaultConfig() {
    return {
        host: null,
        port: 22,
        user: 'anonymous',
        pass: 'anonymous',
        _sensitive: ['pass'],
    };
};

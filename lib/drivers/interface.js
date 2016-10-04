/**
 * The MIT License (MIT)
 * Copyright (c) 2016 GochoMugo <mugo@forfuture.co.ke>
 * Copyright (c) 2016 Forfuture, LLC <we@forfuture.co.ke>
 *
 * This is the driver interface that all drivers must implement.
 */


// built-in modules
const EventEmitter = require('events');


/**
 * The protocol this driver operates over. This helps in finding the
 * right configurations for instances. The 'fpush' core handles
 * passing configurations while constructing new driver instances.
 * This allows multiple drivers to use the same configurations.
 */
exports.protocol = 'none';


exports.Driver = class DriverInterface extends EventEmitter {
    /**
     * Construct a new driver instance. Ensure you invoke the
     * constructor, through a 'super();' statement, in your
     * driver's constructor.
     */
    constructor() {
        super();
    }

    /**
     * Destruct this driver instance. This provides the instance the
     * opportunity to close its connections gracefully, among
     * other possible cleanup tasks.
     *
     * @param  {Function} done(error)
     * @return {this}
     */
    destruct(done) {
        done(new Error('Driver#destruct() not implemented'));
        return this;
    }

    /**
     * Create a directory at relative path 'rpath'. This method
     * should succeed if the directory already exists.
     *
     * @param  {String} rpath Relative path to the new directory
     * @param  {Function} done(error)
     * @return {this}
     */
    mkdir(rpath, done) {
        done(new Error('Driver#mkdir() not implemented'));
        return this;
    }

    /**
     * Retrieve a list of files in directory at relative path 'rpath'.
     * This method should return names of files, not including directories.
     * Directories must be excluded.
     *
     * @param  {String} rpath Relative path to the inspected directory
     * @param  {Function} done(error, filenames)
     * @return {this}
     */
    ls(rpath, done) {
        done(new Error('Driver#ls() not implemented'));
        return this;
    }

    /**
     * Retrieve the content of the file at relative path 'rpath'.
     * This method passes buffer of the file's entire content.
     *
     * @param  {String} rpath Relative path to target file
     * @param  {Function} done(error, contentBuffer)
     * @return {this}
     */
    get(rpath, done) {
        done(new Error('Driver#get() not implemented'));
        return this;
    }

    /**
     * Write the content buffer to the (existing or not) file at
     * relative path 'rpath'. It simply overwrites the remote file.
     *
     * @param  {String} rpath Relative path to written file
     * @param  {Function} done(error)
     * @return {this}
     */
    put(rpath, contentBuffer, done) {
        done(new Error('Driver#put() not implemented'));
        return this;
    }

    /**
     * Delete the file at relative path 'rpath'. This method should
     * succeed if the file is non-existent.
     *
     * @param  {String} rpath Relative path to deleted file
     * @param  {Function} done(error)
     */
    del(rpath, done) {
        return done(new Error('Driver#del() not implemented'));
    }
};


/**
 * Validate the driver's configuration. Throw an exception
 * for any invalidation in the 'config'.
 *
 * @param  {Object} config=null
 * @throws Error
 */
exports.validateConfig = function validateConfig(config) {
   throw new Error('Driver.validateConfig() not implemented');
};


/**
 * Returns the default configurations i.e. key-value pairs in an object,
 * that the driver uses.
 *
 * @return {Object}
 */
exports.defaultConfig = function defaultConfig() {
    return {};
}

/**
 * The MIT License (MIT)
 * Copyright (c) 2016 GochoMugo <mugo@forfuture.co.ke>
 * Copyright (c) 2016 Forfuture, LLC < we@forfuture.co.ke>
 *
 * Hashing of files
 */


exports = module.exports = {
    hashFileBuffer: hashFileBuffer,
};


// built-in modules
const crypto = require('crypto');


/**
 * Create a SHA-256 hash string, using a file buffer.
 *
 * @param {Buffer} fileBuffer
 * @return {String} hash
 */
function hashFileBuffer(fileBuffer) {
    const hash = crypto.createHash('sha256');
    hash.update(fileBuffer);
    return hash.digest('hex');
}

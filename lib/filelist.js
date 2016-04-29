/**
 * The MIT License (MIT)
 * Copyright (c) 2016 GochoMugo <mugo@forfuture.co.ke>
 * Copyright (c) 2016 Forfuture, LLC < we@forfuture.co.ke>
 *
 * Handling the file list
 */


exports = module.exports = {
    parse: parse,
    toBuffer: toBuffer,
};


/**
 * Parse a buffer of a file-list
 *
 * @param {Buffer} buffer
 * @return {Object} filename-SHA pairs
 */
function parse(buffer) {
    const string = buffer.toString();
    var list = {};

    string.split('\n').forEach(function(line) {
        // be tolerant of empty lines
        if (line === '') return;

        var sections = line.split('\t');

        // there must be 2 sections
        if (sections.length !== 2) {
            throw new Error('File list could not be parsed');
        }

        list[sections[0]] = sections[1];
    });

    return list;
}


/**
 * Convert a filelist object into a buffer.
 *
 * @param {Object} list
 * @return {Buffer}
 */
function toBuffer(list) {
    var string = '';
    for (var key in list) {
        string += `${key}\t${list[key]}\n`;
    }
    return Buffer(string);
}

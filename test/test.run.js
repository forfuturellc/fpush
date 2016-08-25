/**
 * The MIT License (MIT)
 * Copyright (c) 2016 GochoMugo <mugo@forfuture.co.ke>
 * Copyright (c) 2016 Forfuture, LLC < we@forfuture.co.ke>
 *
 * Tests
 */


// built-in modules
const path = require('path');


// npm-installed modules
const should = require('should');


// own modules
const ftpush = require('..');


// module variables
const resolvePath = (p) => { return path.join("/home/ftp/ftpush-test", p); };


before(function(done) {
    return ftpush.main({
        configPath: path.join(__dirname, '.ftpush.toml'),
        reporter(emitter) {
            emitter.on("FTPError", console.error);
            emitter.on("Exit", done);
        },
    });
});


describe('test run', function() {
    it("created directories", function(done) {
        const one = !!fs.statSync(resolvePath("one"));
        const two = !!fs.statSync(resolvePath("two"));
        should(one).be.true();
        should(two).be.true();
    });
});

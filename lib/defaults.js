/**
 * The MIT License (MIT)
 * Copyright (c) 2016 GochoMugo <mugo@forfuture.co.ke>
 * Copyright (c) 2016 Forfuture, LLC <we@forfuture.co.ke>
 *
 * The defaults.
 */


// built-in modules
const path = require('path');


// module variables
const cwd = process.cwd();


exports = module.exports = {
    sourceDir: cwd,
    remoteDir: '',
    profile: 'default',
    ftp: {
        host: null,
        port: 21,
        user: "anonymous",
        pass: "anonymous",
    },
    stopOnError: true,
    ignoreDirs: ['.git', '.hg', '.tmp'],
    configFilename: '.ftpush.toml',
    filelistName: '.ftpush.list',
    parallel: 1,
    skipDeletion: false,
    ignoreFilelist: false,
    reporter: 'default',
};

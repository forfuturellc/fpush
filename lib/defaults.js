/**
 * The MIT License (MIT)
 * Copyright (c) 2016 GochoMugo <mugo@forfuture.co.ke>
 * Copyright (c) 2016 Forfuture, LLC <we@forfuture.co.ke>
 *
 * The defaults.
 */


// module variables
const cwd = process.cwd();


exports = module.exports = {
    sourceDir: cwd,
    remoteDir: '',
    profile: 'default',
    stopOnError: true,
    ignoreDirs: ['.git', '.hg', '.tmp'],
    configFilename: '.fpush.toml',
    filelistName: '.fpush.list',
    parallel: 1,
    skipDeletion: false,
    ignoreFilelist: false,
    reporter: 'default',
    dynamicReporter: false,
    driver: 'ftp',
    dynamicDriver: false,
};

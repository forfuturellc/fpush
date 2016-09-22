/**
 * The MIT License (MIT)
 * Copyright (c) 2016 GochoMugo <mugo@forfuture.co.ke>
 * Copyright (c) 2016 Forfuture, LLC <we@forfuture.co.ke>
 *
 * CLI.
 */


exports = module.exports = {
    run,
};


// built-in modules
const path = require('path');


// npm-installed modules
const program = require('commander');
const out = require('cli-output');
const updateNotifier = require('update-notifier');


// own modules
const defaults = require('./defaults');
const main = require('./main');
const pkg = require('../package.json');


program
    .version(pkg.version)
    .option('-d, --source-dir <path>', `source directory [${defaults.sourceDir}]`)
    .option('-r, --remote-dir <path>', `remote directory [${defaults.remoteDir}]`)
    .option('-c, --config-path <path>', `path to config file [./${defaults.configFilename}]`)
    .option('-p, --profile <name>', `configuration profile to use [${defaults.profile}]`)
    .option('-H, --ftp-host <host>', 'FTP host')
    .option('-P, --ftp-port <port>', `FTP port [${defaults.ftp.port}]`)
    .option('-U, --ftp-user <user>', `FTP username [${defaults.ftp.user}]`)
    .option('-X, --ftp-pass <pass>', `FTP password [${defaults.ftp.pass}]`)
    .option('-s, --stop-on-error', `stop on error [${defaults.stopOnError}]`)
    .option('-j, --parallel <num>', `handle <num> directories at a time [${defaults.parallel}]`)
    .option('-k, --skip-deletion', `skip deleting remote files [${defaults.skipDeletion}]`)
    .option('-i, --ignore-filelist', `ignore file-list [${defaults.ignoreFilelist}]`)
    .option('-e, --reporter <reporter>', `reporter to use for results display; default,loud [${defaults.reporter}]`)
    ;


function run() {
    program.parse(process.argv);

    // try loading the reporter
    const reporterName = program.reporter || defaults.reporter;
    let reporter;
    try {
        reporter = require(path.join(__dirname, 'reporters', reporterName));
    } catch(ex) {
        out.error('Reporter missing');
        return 1;
    }

    return main({
        reporter,
        sourceDir: program.sourceDir,
        remoteDir: program.remoteDir,
        configPath: program.configPath,
        profile: program.profile,
        ftp: {
            host: program.ftpHost,
            port: program.ftpPort,
            user: program.ftpUser,
            pass: program.ftpPass,
        },
        stopOnError: program.stopOnError,
        parallel: program.parallel,
        skipDeletion: program.skipDeletion,
        ignoreFilelist: program.ignoreFilelist,
    }).on('Exit', function() {
        updateNotifier({ pkg }).notify();
    });
}

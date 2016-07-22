/**
 * The MIT License (MIT)
 * Copyright (c) 2016 GochoMugo <mugo@forfuture.co.ke>
 * Copyright (c) 2016 Forfuture, LLC < we@forfuture.co.ke>
 *
 * CLI.
 */


exports = module.exports = {
    run,
};


// npm-installed modules
const program = require('commander');
const out = require('cli-output');


// own modules
const defaults = require('./defaults');
const main = require('./main');
const pkg = require('../package.json');


program
    .version(pkg.version)
    .option('-d, --source-dir <path>', `source directory [${defaults.sourceDir}]`)
    .option('-r, --remote-dir <path>', `remote directory [${defaults.remoteDir}]`)
    .option('-c, --config-path <path>', `path to config file [\${sourceDir}/${defaults.configfileName}]`)
    .option('-p, --profile <name>', `configuration profile to use [${defaults.profile}]`)
    .option('-H, --ftp-host <host>', 'FTP host')
    .option('-P, --ftp-port <port>', 'FTP port')
    .option('-U, --ftp-user <user>', 'FTP username')
    .option('-X, --ftp-pass <pass>', 'FTP password')
    .option('-s, --stop-on-error', `stop on error; [${defaults.skipDeletion}]`)
    .option('-j, --parallel <num>', `handle <num> directories at a time [${defaults.parallel}]`)
    .option('-k, --skip-deletion', `skip deleting remote files [${defaults.skipDeletion}]`)
    .option('-i, --ignore-filelist', `ignore file-list [${defaults.ignoreFilelist}]`)
    ;


function run() {
    program.parse(process.argv);

    return main({
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
    })
    .on('DirDone', function(err, dirpath) {
        if (err) return out.error(`DirDone with Error: ${dirpath} :: ${err}`);
        return out.info(`DirDone: ${dirpath}`);
    })
    .on('ConfigError', function(err) {
        return out.error(`ConfigError: ${err}`);
    })
    .on('WalkerError', function(err) {
        return out.error(`WalkerError: ${err}`);
    })
    .on('FTPError', function(err) {
        return out.error(`FTPError: ${err}`);
    })
    .on('Exit', function(err) {
        return out.info(`Exit :: ${err}`);
    })
    ;
}

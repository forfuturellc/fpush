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
    .option('--ftp-host <host>', 'FTP host')
    .option('--ftp-port <port>', `FTP port [${defaults.ftp.port}]`)
    .option('--ftp-user <user>', `FTP username [${defaults.ftp.user}]`)
    .option('--ftp-pass <pass>', `FTP password [${defaults.ftp.pass}]`)
    .option('--sftp-host <host>', 'SFTP host')
    .option('--sftp-port <port>', `SFTP port [${defaults.sftp.port}]`)
    .option('--sftp-user <user>', `SFTP username [${defaults.sftp.user}]`)
    .option('--sftp-pass <pass>', `SFTP password [${defaults.sftp.pass}]`)
    .option('-s, --stop-on-error', `stop on error [${defaults.stopOnError}]`)
    .option('-j, --parallel <num>', `handle <num> directories at a time [${defaults.parallel}]`)
    .option('-k, --skip-deletion', `skip deleting remote files [${defaults.skipDeletion}]`)
    .option('-i, --ignore-filelist', `ignore file-list [${defaults.ignoreFilelist}]`)
    .option('-e, --reporter <reporter>', `reporter to use for results display; default,loud [${defaults.reporter}]`)
    .option('-h, --dynamic-reporter', `load reporter dynamically [${defaults.dynamicReporter}]`)
    .option('-w, --driver <driver>', `driver to use; ftp,sftp [${defaults.driver}]`)
    .option('-x, --dynamic-driver', `load driver dynamically [${defaults.dynamicDriver}]`)
    .option('-cn, --config-filename <filename>', `name of the config file [${defaults.configFilename}]`)
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
        sftp: {
            host: program.sftpHost,
            port: program.sftpPort,
            user: program.sftpUser,
            pass: program.sftpPass,
        },
        stopOnError: program.stopOnError,
        parallel: program.parallel,
        skipDeletion: program.skipDeletion,
        ignoreFilelist: program.ignoreFilelist,
        reporter: program.reporter,
        dynamicReporter: program.dynamicReporter,
        driver: program.driver,
        dynamicDriver: program.dynamicDriver,
        configFilename: program.configFilename,
    }).on('Exit', function() {
        updateNotifier({ pkg }).notify();
    });
}

/**
 * The MIT License (MIT)
 * Copyright (c) 2016 GochoMugo <mugo@forfuture.co.ke>
 * Copyright (c) 2016 Forfuture, LLC < we@forfuture.co.ke>
 *
 * The 'default' reporter.
 */


exports = module.exports = reporter;


// npm-installed modules
const chalk = require('chalk');
const logUpdate = require('log-update');
const unicons = require('unicons');


// module variables
const dirs = {};
const errors = {};
let eindex = 1;
const status = {
    working: 1,
    done: 2,
    error: 3,
};


function reporter(emitter) {
    return emitter.on('Config', function(config) {
        const parallel = config.parallel <= 0 ? "+inf" : config.parallel;
        console.log(chalk.gray([
            `[${config.profile}] `,
            `${config.ftp.user}@${config.ftp.host}:${config.ftp.port}`,
        ].join("")));
    })
    .on('DirInfo', function(dirpath) {
        dirs[dirpath] = { status: status.working };
        log();
    })
    .on('DirDone', function(error, dirpath) {
        if (error) {
            dirs[dirpath].status = status.error;
            errors[eindex++] = { error };
        } else {
            dirs[dirpath].status = status.done;
        }
        log();
    })
    .on('ConfigError', function(error) {
        errors[eindex++] = { error };
        log();
    })
    .on('WalkerError', function(error) {
        errors[eindex++] = { error };
        log();
    })
    .on('FTPError', function(error) {
        errors[eindex++] = { error };
        log();
    })
    .on('Exit', function(err) {
        logUpdate.done();
    })
    ;
}


function log() {
    let dirOutput = '';
    let countDone = 0;
    const dirpaths = Object.keys(dirs).sort();

    dirpaths.forEach(function(key) {
        const dir = dirs[key];
        let icon;
        switch (dir.status) {
        case status.working:
            icon = chalk.gray(unicons.circle);
            break;
        case status.done:
            icon = chalk.green(unicons.circle);
            countDone++;
            break;
        case status.error:
            icon = chalk.red(unicons.circle);
            break;
        }
        dirOutput += '\t' + icon + ' ' + chalk.gray(key) + "\n";
    });

    let countOutput = '\t' + countDone + '/' + dirpaths.length
        + ' pushed\n';

    let errorOutput = '';
    Object.keys(errors).sort().forEach(function(key) {
        const error = errors[key];
        errorOutput += '\t' + chalk.red(error.error.message) + '\n';
    });

    let output = '\n' + dirOutput;
    if (errorOutput) output += '\n\n' + errorOutput;
    output += '\n\n' + countOutput;

    return logUpdate(output);
}

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
const diffs = {};


function reporter(emitter) {
    return emitter.on('Config', function(config) {
        const parallel = config.parallel <= 0 ? "+inf" : config.parallel;
        const driver = config.driverConfig;
        console.log(chalk.gray([
            `[${config.profile}] p=${parallel} `,
            driver.user ? `${driver.user}@` : '',
            driver.host ? `${driver.host}` : '',
            driver.port ? `:${driver.port}` : '',
        ].join("")));
    })
    .on('DirInfo', function(dirpath, info) {
        dirs[dirpath] = info;
        log();
    })
    .on('DirDone', function(error, dirpath, info) {
        dirs[dirpath] = info;
        if (error) errors[eindex++] = { error };
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
    .on('DriverError', function(error) {
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
        const info = dirs[key];
        let icon;
        let action;
        switch (info.status) {
        case info.constants.status.queued:
            icon = chalk.gray(unicons.circle);
            action = chalk.gray('queued');
            break;
        case info.constants.status.push:
            icon = chalk.blue(unicons.circle);
            switch (info.stage) {
            case info.constants.stage.remoteState:
                action = 'checking remote state';
                break;
            case info.constants.stage.localState:
                action = 'checking local state';
                break;
            case info.constants.stage.diffs:
                action = 'generating diffs';
                break;
            case info.constants.stage.update:
                action = 'pushing files';
                diffs[key] = info.diffs;
                break;
            }
            action = chalk.gray(action);
            break;
        case info.constants.status.done:
            icon = chalk.green(unicons.circle);
            action = '';
            countDone++;
            break;
        case info.constants.status.error:
            icon = chalk.red(unicons.circle);
            action = chalk.red('errored');
            break;
        }
        dirOutput += '\t' + icon + ' ' + chalk.magenta(key)
        if (diffs[key]) {
            let diff = ' '
                + '+' + diffs[key].changed.length
                + '/-' + diffs[key].deleted.length;
            dirOutput += chalk.gray(diff);
        }
        if (action) dirOutput += ' ... ' + action;
        dirOutput += '\n';
    });

    let countOutput = '\t directories: ' + countDone + '/' + dirpaths.length
        + ' pushed\n';
    let countUpdated = 0;
    let countDeleted = 0;
    for (let diffKey in diffs) {
        const diff = diffs[diffKey];
        countUpdated += diff.changed.length;
        countDeleted += diff.deleted.length;
    }
    countOutput += '\t files: '
        + countUpdated + ' updated, '
        + countDeleted + ' deleted\n';

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

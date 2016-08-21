const path = require('path');
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
    configfileName: '.ftpush.toml',
    filelistName: '.ftpush.list',
    parallel: 1,
    skipDeletion: false,
    ignoreFilelist: false,
    reporter: "default",
};

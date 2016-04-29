const path = require('path');
const cwd = process.cwd();

exports = module.exports = {
    sourceDir: cwd,
    remoteDir: "",
    profile: 'default',
    ftp: {
        host: null,
        port: 21,
        user: null,
        pass: null,
    },
    stopOnError: false,
    ignoreDirs: ['.git', '.hg', '.tmp'],
    configfileName: '.ftpush.toml',
    filelistName: '.ftpush.list',
};

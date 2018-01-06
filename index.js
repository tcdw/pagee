#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const util = require('./lib/function');
const doRender = require('./lib/render');
const ncp = require('ncp');
const childProcess = require('child_process');

const ncpOpts = {
    filter: filepath => path.basename(filepath).indexOf('.') !== 0,
};

const printHelp = () => {
    console.error('Usage: pagee operation [config_file]');
    console.error('Avaliable operations:');
    console.error('\tinit\tCopy the sample config file into your current working directory');
    console.error('\trender\tRender the website');
    process.exit(1);
};

if (typeof fs.copyFileSync === 'undefined') {
    fs.copyFileSync = (from, to) => {
        fs.createReadStream(from).pipe(fs.createWriteStream(to));
        return to;
    };
}

if (typeof process.argv[2] === 'undefined') {
    printHelp();
}

switch (process.argv[2]) {
case 'init': {
    if (fs.readdirSync(process.cwd()).length != 0) {
        util.printLog('error', 'Current working directory not empty, abort.');
        process.exit(1);
    } else {
        util.printLog('info', 'Initializing new working directory...');
        ncp(path.resolve(__dirname, 'sample/'), process.cwd(), ncpOpts, (err) => {
            if (err) {
                util.printLog('error', err);
                process.exit(1);
            }
            const child = childProcess.spawn('git', [
                'clone',
                'https://git.reallserver.cn/tcdw/pagee-template-default',
                path.resolve(process.cwd(), 'template/default'),
            ], {
                stdio: 'inherit',
            });
            child.on('exit', () => {
                util.printLog('info', 'Done!');
                util.printLog('info', `Template config files copied to \x1b[33m${process.cwd()}`);
                process.exit(0);
            });
        });
    }
    break;
}
case 'render': {
    const configPath = typeof process.argv[3] === 'undefined' ? 'config.json' : process.argv[3];
    fs.readFile(path.resolve(process.cwd(), configPath), { encoding: 'utf8' }, (err, data) => {
        if (err) {
            util.printLog('error', err);
            process.exit(1);
        }
        doRender(process.cwd(), JSON.parse(data));
    });
    break;
}
default: {
    printHelp();
}
}

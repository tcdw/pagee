#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const util = require('./lib/function');
const doRender = require('./lib/render');

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
    let configFileName = 'config.json';
    if (fs.existsSync('config.json')) {
        let d = 0;
        while (fs.existsSync(`config.${d}.json`)) {
            d += 1;
        }
        configFileName = `config.${d}.json`;
    }
    fs.copyFileSync(
        path.resolve(__dirname, 'config.example.json'),
        path.resolve(process.cwd(), configFileName),
    );
    util.printLog('info', `Template config file copied to \x1b[33m${path.resolve(process.cwd(), configFileName)}`);
    process.exit(0);
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

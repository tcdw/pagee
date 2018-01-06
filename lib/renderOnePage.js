const util = require('./function');
const path = require('path');
const fs = require('fs');
const hljs = require('highlight.js');
const md = require('markdown-it')({
    highlight: (str, lang) => {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch (e) {
                util.printLog('error', e);
            }
        }
        return '';
    },
    html: true,
});

module.exports = (file, masterPath) => {
    const fullPath = path.resolve(masterPath, file);
    const data = fs.readFileSync(fullPath, { encoding: 'utf8' });
    switch (path.parse(fullPath).ext) {
    case '.md': {
        return {
            format: 'md',
            stat: fs.statSync(fullPath),
            result: md.render(data),
        };
    }
    case '.htm':
    case '.html': {
        return {
            format: 'html',
            stat: fs.stat(fullPath),
            result: data,
        };
    }
    default: {
        util.printLog('warn', `Unhandled page: ${fullPath}`);
        break;
    }
    }
    return true;
};

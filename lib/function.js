const fs = require('fs');
const path = require('path');

module.exports = {
    /**
     * 向终端发送一行日志内容
     * @param {string} level - 日志级别，可以是 info、warn、error
     * @param {string} text - 日志文本
     * @returns {boolean} 是否发送成功
     */
    printLog: (level, text) => {
        let tmpText = '';
        let logFunc;
        switch (level) {
        case 'info':
            logFunc = console.log;
            tmpText += '\x1b[36m[INFO]\x1b[0m ';
            break;
        case 'warn':
            logFunc = console.warn;
            tmpText += '\x1b[33m[WARN]\x1b[0m ';
            break;
        case 'error':
            logFunc = console.error;
            tmpText += '\x1b[31m[ERROR]\x1b[0m ';
            break;
        default:
            return false;
        }
        logFunc(`${tmpText + text}\x1b[0m`);
        return true;
    },
    walkSync: (dir, len = 0, filelist = []) => {
        const files = fs.readdirSync(dir);
        let list = filelist;
        files.forEach((file) => {
            if (fs.statSync(path.join(dir, file)).isDirectory()) {
                list = module.exports.walkSync(path.join(dir, file), len, filelist);
            } else {
                list.push(path.join(dir, file).slice(len));
            }
        });
        return list;
    },
    replaceFileExtension: (fileName, ext) => fileName.slice(0, fileName.lastIndexOf('.') + 1) + ext,
};

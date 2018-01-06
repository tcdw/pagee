const util = require('./function');
const renderOnePage = require('./renderOnePage');
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');
const md5File = require('md5-file');
const ncp = require('ncp');
const mkdirp = require('mkdirp');

const ncpOpts = {
    filter: filepath => path.basename(filepath).indexOf('.') !== 0,
};

const checkFormat = file => file.indexOf('.md') === file.length - 3
    || file.indexOf('.htm') === file.length - 4
    || file.indexOf('.html') === file.length - 5;

module.exports = (cwd, config) => {
    const fullPath = path.resolve(cwd, config.path, 'page');
    const fullReleasePath = path.resolve(cwd, config.path, 'release');
    const templatePath = path.resolve(cwd, config.path, 'template');
    const template = handlebars.compile(fs.readFileSync(path.resolve(templatePath, config.template, 'index.hbs'), { encoding: 'utf8' }));
    const userHander = fs.readFileSync(path.resolve(templatePath, 'userHeader.html'), { encoding: 'utf8' });
    const userFooter = fs.readFileSync(path.resolve(templatePath, 'userFooter.html'), { encoding: 'utf8' });
    const allFiles = util.walkSync(fullPath, fullPath.length + 1);
    const docs = allFiles.filter(checkFormat);
    handlebars.registerHelper('assets', (str) => {
        const hash = md5File.sync(path.resolve(templatePath, config.template, 'assets', str)).slice(0, 10);
        return new handlebars.SafeString(`${config.pathPrefix}assets${path.sep}${str}?${hash}`);
    });
    if (docs.length === 0) {
        util.printLog('error', 'No pages found');
        process.exit(1);
    }
    util.printLog('info', `${docs.length} pages found`);
    docs.forEach((pathName) => {
        const docData = renderOnePage(pathName, fullPath);
        const page = JSON.parse(fs.readFileSync(path.resolve(fullPath, util.replaceFileExtension(pathName, 'json')), { encoding: 'utf8' }));
        const builtHTML = template({
            config,
            page,
            userHander,
            userFooter,
            url: path.resolve(config.pathPrefix, util.replaceFileExtension(pathName, 'html')),
            html: docData.format === 'html',
            content: docData.result,
            lastMod: docData.stat.mtime.toISOString(),
        });
        mkdirp.sync(path.dirname(path.resolve(fullReleasePath, pathName)));
        fs.writeFileSync(path.resolve(fullReleasePath, util.replaceFileExtension(pathName, 'html')), builtHTML);
        return path;
    });
    ncp(path.resolve(templatePath, config.template, 'assets'), path.resolve(fullReleasePath, 'assets'), ncpOpts, (err) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        util.printLog('info', 'Template assets directory copied');
    });
    return true;
};

const _ = require('lodash');
const tmpl = require('blueimp-tmpl');
const refactor = require('../refactor');
const prototype = require('../prototype/router');

const FILENAME = 'router.js'

function init(feature) {
    const targetPath = refactor.getFeatureFolder(feature) + '/' + FILENAME;
    const routerLines = [];
    refactor.writeLine(routerLines, 0, tmpl(prototype, {}));
    refactor.save(targetPath, routerLines);

    refactor.success(`${targetPath} was created`);
}

module.exports = {
    init,
    FILENAME
};

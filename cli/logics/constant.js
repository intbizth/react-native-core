const _ = require('lodash');
const refactor = require('../refactor');
const CONSTANTS = require('../constants');

function add(feature, name, options) {
    name = _.toUpper(name);
    const targetPath = refactor.getReduxFolder(feature) + '/constants.js';
    const lines = refactor.getLines(targetPath);
    const i = refactor.lastLineIndex(lines, /^export /);

    if(!refactor.isStringMatch(lines.join(" "), new RegExp(`(.+)export const ${name}(.+)`))) {
        lines.splice(i + 1, 0, `export const ${name} = ${_getFunc(options.type)}("${name}");`);
    }

    if (options.withReducer) {
        if(!refactor.isStringMatch(lines.join(" "), new RegExp(`(.+)export const ${name}_STATE_KEY(.+)`))) {
            lines.splice(i + 2, 0, `export const ${name}_STATE_KEY = "${options.withReducer}";`);
        }
    }

    refactor.save(targetPath, lines);

    refactor.updateFile(targetPath, ast => [].concat(
        refactor.addImportFrom(ast, `${CONSTANTS.PACKAGE_NAME}/api/submit/actions`, '', [_getFunc(options.type)])
    ));

    return name;
}

function _getFunc(actionType) {
    switch (actionType) {
        case 'request':
            return 'createRequestTypes';
        case 'submit':
            return 'createSubmitTypes';
        case 'paginate':
            return 'createPaginateTypes';
    }

    throw new Error(`Unexpected type ${actionType}`);
}

module.exports = {
    add,
};

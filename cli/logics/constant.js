const _ = require('lodash');
const refactor = require('../refactor');
const CONSTANTS = require('../constants');

function add(feature, name, options) {
    name = _.toUpper(_.snakeCase(name));
    const targetPath = refactor.getReduxFolder(feature) + '/constants.js';
    const lines = refactor.getLines(targetPath);
    const i = refactor.lastLineIndex(lines, /^export /);

    if(!refactor.isStringMatch(lines.join(" "), new RegExp(`(.+)export const ${name}(.+)`))) {
        refactor.success(`Constant: "${name}" created in "${targetPath}"`);
        lines.splice(i + 1, 0, `export const ${name} = ${_getFunc(options.type)}("${name}");`);
    }

    if (options.withReducer) {
        if(!refactor.isStringMatch(lines.join(" "), new RegExp(`(.+)export const ${name}_STATE_KEY(.+)`))) {
            refactor.success(`Constant: "${name}_STATE_KEY" created in "${targetPath}"`);
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

const _ = require('lodash');
const refactor = require('../refactor');
const CONSTANTS = require('../constants');

function add({feature, name, type, withReducer}) {
    const constName = makeConstantName(name);
    const targetPath = refactor.getReduxFolder(feature) + '/constants.js';
    const lines = refactor.getLines(targetPath);
    const i = refactor.lastLineIndex(lines, /^export /);

    if(!refactor.isStringMatch(lines.join(" "), new RegExp(`(.+)export const ${constName}(.+)`))) {
        refactor.success(`Constant: "${constName}" created in "${targetPath}"`);
        lines.splice(i + 1, 0, `export const ${constName} = ${_getFunc(type)}("${constName}");`);
    }

    if (withReducer) {
        const constStateKeyName = makeConstantStateKeyName(name);
        if(!refactor.isStringMatch(lines.join(" "), new RegExp(`(.+)export const ${constStateKeyName}(.+)`))) {
            refactor.success(`Constant: "${constStateKeyName}" created in "${targetPath}"`);
            lines.splice(i + 2, 0, `export const ${constStateKeyName} = "${withReducer}";`);
        }
    }

    refactor.save(targetPath, lines);

    refactor.updateFile(targetPath, ast => [].concat(
        refactor.addImportFrom(ast, `${CONSTANTS.PACKAGE_NAME}/api/submit/action`, '', [_getFunc(type)])
    ));
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

    refactor.error(`Unexpected type ${actionType}`);
}


function makeConstantName(name) {
    return _.toUpper(_.snakeCase(name));
}

function makeConstantStateKeyName(name) {
    return makeConstantName(name) + '_STATE_KEY';
}

module.exports = {
    add,
    makeConstantName,
    makeConstantStateKeyName
};

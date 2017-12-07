const _ = require('lodash');
const refactor = require('../refactor');
const makeConstantName = require('./constant').makeConstantName;
const CONSTANTS = require('../constants');


function add({feature, name, type}) {
    const actionName = makeActionName(name);
    const constantName = makeConstantName(name);

    const targetPath = refactor.getReduxFolder(feature) + '/actions.js';
    const lines = refactor.getLines(targetPath);

    if(refactor.isStringMatch(lines.join(" "), new RegExp(`(.+)export const ${actionName}(.+)`))) {
        refactor.info(`Action: "${actionName}" exists in "${targetPath}"`);
        return;
    }

    const i = refactor.lastLineIndex(lines, /(.+)/);
    lines.splice(i + 1, 0, `export const ${actionName} = ${_getFunc(type)}(${constantName});`);
    refactor.save(targetPath, lines);

    refactor.updateFile(targetPath, ast => [].concat(
        refactor.addImportFrom(ast, `${CONSTANTS.PACKAGE_NAME}/api/submit/action`, '', [_getFunc(type)]),
        refactor.addImportFrom(ast, `./constants`, '', [constantName])
    ));

    refactor.success(`Action: "${actionName}" created in "${targetPath}"`);
}

function _getFunc(actionType) {
    switch (actionType) {
        case 'request':
            return 'AbstractRequestAction';
        case 'submit':
            return 'AbstractSubmitAction';
        case 'paginate':
            return 'AbstractPaginateAction';
    }

    refactor.error(`Unexpected type ${actionType}`);
}

function makeActionName(name) {
    return _.camelCase(name);
}

module.exports = {
    add,
    makeActionName
};

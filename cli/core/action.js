const _ = require('lodash');
const tmpl = require('blueimp-tmpl');
const refactor = require('../refactor');
const makeConstantName = require('./constant').makeConstantName;
const CONSTANTS = require('../constants');
const prototype = require('../prototype/action');


function add({feature, name, type}) {
    const actionName = makeActionName(name);
    const actionCreator = _getFunc(type);
    const constantName = makeConstantName(name);
    const actionTpl = tmpl(prototype, { actionName, actionCreator, constantName });

    const targetPath = refactor.getReduxFolder(feature) + '/actions.js';
    const lines = refactor.getLines(targetPath);

    if(refactor.isStringMatch(lines.join(" "), actionTpl)) {
        refactor.info(`Action: "${actionName}" exists in "${targetPath}"`);
        return;
    }

    refactor.writeLine(lines, lines.length, actionTpl);
    refactor.save(targetPath, lines);

    refactor.updateFile(targetPath, ast => [].concat(
        refactor.addImportFrom(ast, `${CONSTANTS.PACKAGE_NAME}/api/submit/action`, '', [actionCreator]),
        refactor.addImportFrom(ast, `./constants`, '', [constantName])
    ));

    refactor.success(`Action: "${actionName}" created in "${targetPath}"`);
}

function remove({feature, name, type}) {
    const actionName = makeActionName(name);
    const constantName = makeConstantName(name);
    const actionCreator = _getFunc(type);
    const actionTpl = tmpl(prototype, { actionName, actionCreator, constantName });

    const targetPath = refactor.getReduxFolder(feature) + '/actions.js';
    const lines = refactor.getLines(targetPath);

    refactor.removeLines(lines, actionTpl);
    refactor.save(targetPath, lines);

    refactor.updateFile(targetPath, ast => [].concat(
        refactor.removeImportSpecifier(ast, actionCreator),
        refactor.removeImportSpecifier(ast, constantName)
    ));

    refactor.success(`Action: "${actionName}" removed in "${targetPath}"`);
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
    remove,
    makeActionName
};

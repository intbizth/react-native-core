const _ = require('lodash');
const tmpl = require('blueimp-tmpl');
const refactor = require('../refactor');
const CONSTANTS = require('../constants');
const prototype = require('../prototype/constant');

function add({feature, name, type, withReducer}) {
    const constName = makeConstantName(name);
    const constCreator = _getFunc(type);
    const targetPath = refactor.getReduxFolder(feature) + '/constants.js';
    const lines = refactor.getLines(targetPath);
    const i = refactor.lastLineIndex(lines, /^export /);

    const constTpl = tmpl(prototype.constant, {
        constName,
        constCreator,
    });
    if(!refactor.isStringMatch(lines.join(" "), constTpl)) {
        refactor.writeLine(lines, i + 1, constTpl);
        refactor.success(`Constant: "${constName}" created in "${targetPath}"`);
    }

    if (withReducer) {
        const constStateKeyName = makeConstantStateKeyName(name);
        const constWithReducerTpl = tmpl(prototype.constantWithReducer, {
            constName: constStateKeyName,
            stateKey: withReducer,
        });
        if(!refactor.isStringMatch(lines.join(" "), constWithReducerTpl)) {
            refactor.writeLine(lines, i + 2, constWithReducerTpl);
            refactor.success(`Constant: "${constStateKeyName}" created in "${targetPath}"`);
        }
    }

    refactor.save(targetPath, lines);

    refactor.updateFile(targetPath, ast => [].concat(
        refactor.addImportFrom(ast, `${CONSTANTS.PACKAGE_NAME}/api/${type}/action`, '', [constCreator])
    ));
}

function remove({feature, name}) {
    const constName = makeConstantName(name);
    const constStateKeyName = makeConstantStateKeyName(name);
    const targetPath = refactor.getReduxFolder(feature) + '/constants.js';
    const lines = refactor.getLines(targetPath);

    const i = _.findIndex(lines, l => new RegExp(`^export const ${constName}`).test(l));
    if (-1 === i) {
        refactor.error(`Not found action name "${name}"`);
    }

    let type = '';
    _.forEach(['request', 'submit', 'paginate'] ,(v) => {
        if (-1 !== lines[i].indexOf(_getFunc(v))) {
            type = v;
        }
    });

    if ('' === type) {
        refactor.error(`Not found action type`);
    }

    const constCreator = _getFunc(type);

    const constTpl = tmpl(prototype.constant, {
        constName,
        constCreator,
    });
    refactor.removeLines(lines, constTpl);
    refactor.removeLines(lines, new RegExp(`^export const ${constStateKeyName} `));
    refactor.save(targetPath, lines);

    refactor.updateFile(targetPath, ast => [].concat(
        refactor.removeImportSpecifier(ast, [_getFunc(type)])
    ));

    refactor.success(`Constant: "${constName}" removed in "${targetPath}"`);
    return type;
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
    remove,
    makeConstantName,
    makeConstantStateKeyName
};

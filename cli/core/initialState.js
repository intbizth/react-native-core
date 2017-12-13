const _ = require('lodash');
const refactor = require('../refactor');
const CONSTANTS = require('../constants');
const tmpl = require('blueimp-tmpl');
const { makeConstantStateKeyName } = require('./constant');
const prototype = require('../prototype/initialState');

const FILENAME = 'initialState.js';

function init(feature) {
    const targetPath = refactor.getReduxFolder(feature) + '/' + FILENAME;

    const lines = [];
    refactor.writeLine(lines, 0, tmpl(prototype.init, {}));
    refactor.save(targetPath, lines);

    refactor.success(`${targetPath} was created`);
}

function add({feature, name, type, withReducer}) {
    if (!withReducer) {
        return;
    }

    const targetPath = refactor.getReduxFolder(feature) + '/' + FILENAME;
    const stateKeyName = makeConstantStateKeyName(name);

    const lines = refactor.getLines(targetPath);
    const i = refactor.lastLineIndex(lines, /^const initialState =/);
    if (-1 === i) {
        refactor.error(`${targetPath} const initialState is not defined`);
    }

    if ('paginate' === type) {
        refactor.updateFile(targetPath, ast => [].concat(
            refactor.addImportFrom(ast, `./constants`, '', [stateKeyName]),
            refactor.addImportFrom(ast, `${CONSTANTS.PACKAGE_NAME}/api/paginate/reducer`, '', ['makeInitialState']),
            refactor.addObjectProperty(ast, 'initialState', '', `...makeInitialState(${stateKeyName})`)
        ));
    } else {
        refactor.updateFile(targetPath, ast => [].concat(
            refactor.addImportFrom(ast, `./constants`, '', [stateKeyName]),
            refactor.addObjectProperty(ast, 'initialState', `[${stateKeyName}]`, 'null')
        ));
    }

    refactor.success(`InitialState: "${stateKeyName}" created in "${targetPath}"`);
}

function remove({feature, name, type}) {
    const targetPath = refactor.getReduxFolder(feature) + '/' + FILENAME;
    const stateKeyName = makeConstantStateKeyName(name);

    if ('paginate' === type) {
        refactor.updateFile(targetPath, ast => [].concat(
            refactor.removeObjectProperty(ast, 'initialState', `...makeInitialState(${stateKeyName})`)
        ));
        refactor.updateFile(targetPath, ast => [].concat(
            refactor.removeImportSpecifier(ast, stateKeyName),
            refactor.removeImportSpecifier(ast, 'makeInitialState'),
        ));
    } else {
        refactor.updateFile(targetPath, ast => [].concat(
            refactor.removeObjectProperty(ast, 'initialState', `[${stateKeyName}]`)
        ));
        refactor.updateFile(targetPath, ast => [].concat(
            refactor.removeImportSpecifier(ast, stateKeyName),
        ));
    }

    refactor.success(`InitialState: "${stateKeyName}" removed in "${targetPath}"`);
}

module.exports = {
    init,
    add,
    remove,
    FILENAME
};

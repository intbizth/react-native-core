const _ = require('lodash');
const refactor = require('../refactor');
const CONSTANTS = require('../constants');
const makeConstantStateKeyName = require('./constant').makeConstantStateKeyName;


function add({feature, name, type, withReducer}) {
    if (!withReducer) {
        return;
    }

    const targetPath = refactor.getReduxFolder(feature) + '/initialState.js';
    const stateKeyName = makeConstantStateKeyName(name);

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
    const targetPath = refactor.getReduxFolder(feature) + '/initialState.js';
    const stateKeyName = makeConstantStateKeyName(name);

    if ('paginate' === type) {
        refactor.updateFile(targetPath, ast => [].concat(
            refactor.removeImportSpecifier(ast, stateKeyName),
            refactor.removeImportSpecifier(ast, 'makeInitialState'),
            refactor.removeObjectProperty(ast, 'initialState', `...makeInitialState(${stateKeyName})`)
        ));
    } else {
        refactor.updateFile(targetPath, ast => [].concat(
            refactor.removeImportSpecifier(ast, stateKeyName),
            refactor.removeObjectProperty(ast, 'initialState', `[${stateKeyName}]`)
        ));
    }

    refactor.success(`InitialState: "${stateKeyName}" removed in "${targetPath}"`);
}

module.exports = {
    add,
    remove
};

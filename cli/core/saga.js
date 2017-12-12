const _ = require('lodash');
const tmpl = require('blueimp-tmpl');
const refactor = require('../refactor');
const { makeActionName } = require('./action');
const { makeConstantName } = require('./constant');
const { makeConstantStateKeyName } = require('./constant');
const CONSTANTS = require('../constants');
const prototype = require('../prototype/saga');

function add({feature, name, type, withSaga}) {
    const reduxFolder = refactor.getReduxFolder(feature);

    if (!refactor.dirExists(reduxFolder + '/reducers')) {
        refactor.mkdir(reduxFolder + '/reducers');
    }

    const targetPath =  `${reduxFolder}/reducers/${_.snakeCase(withSaga)}.js`;

    let lines = [];
    if (refactor.fileExists(targetPath)) {
        lines = refactor.getLines(targetPath);
    }

    const sagaName = makeSagaName(name, type);
    const constantName = makeConstantName(name);
    const constantStateKeyName = makeConstantStateKeyName(name);
    const actionName = makeActionName(name);
    const actionSaga = _getActionSaga(type);

    if(refactor.isStringMatch(lines.join(" "), new RegExp(`(.+)export const ${sagaName}(.+)`))) {
        refactor.info(`Saga: "${sagaName}" exists in "${targetPath}"`);
        return;
    }


    const sagaCode = tmpl(prototype[type].code, {
        sagaName,
        constantName,
        actionName,
        constantStateKeyName,
        actionSaga,
        featureReducerKey: _.snakeCase(feature)
    });

    let i = refactor.lastLineIndex(lines, /^export const reducer/);
    if (-1 === i) {
        i = lines.length + 1;
    }

    refactor.writeLine(lines, i, sagaCode);
    refactor.save(targetPath, lines);

    refactor.updateFile(targetPath, ast => [].concat(
        refactor.addImportFrom(ast, `redux-saga/effects`, '', prototype[type].sagaImports),
        refactor.addImportFrom(ast, `${CONSTANTS.PACKAGE_NAME}/api/${_getFolderActionSaga(type)}/saga`, '', [actionSaga]),
        refactor.addImportFrom(ast, `../constants`, '', [constantName]),
        refactor.addImportFrom(ast, `../actions`, '', [actionName]),
    ));

    if ('paginate' === type) {
        refactor.updateFile(targetPath, ast => [].concat(
            refactor.addImportFrom(ast, `../constants`, '', [constantStateKeyName]),
        ));
    }

    refactor.success(`Saga: "${sagaName}" created in "${targetPath}"`);
}

function remove({feature, name, type, withSaga}) {
    const reduxFolder = refactor.getReduxFolder(feature);

    const targetPath =  `${reduxFolder}/reducers/${_.snakeCase(withSaga)}.js`;
    if (!refactor.fileExists(targetPath)) {
        return;
    }

    const sagaName = makeSagaName(name, type);
    const constantName = makeConstantName(name);
    const constantStateKeyName = makeConstantStateKeyName(name);
    const actionName = makeActionName(name);

    refactor.updateFile(targetPath, ast => [].concat(
        refactor.removeExportSpecifier(ast, sagaName)
    ));

    refactor.updateFile(targetPath, ast => [].concat(
        refactor.removeImportSpecifier(ast, _getActionSaga(type)),
        refactor.removeImportSpecifier(ast, [constantName, constantStateKeyName]),
        refactor.removeImportSpecifier(ast, actionName),
    ));

    refactor.success(`Saga: "${sagaName}" removed in "${targetPath}"`);
}

function removeEmptyFile({feature, withSaga}) {
    const reduxFolder = refactor.getReduxFolder(feature);
    const targetPath =  `${reduxFolder}/reducers/${_.snakeCase(withSaga)}.js`;
    if (!refactor.fileExists(targetPath)) {
        return;
    }

    if (!refactor.removeFileWhichNoExported(targetPath)) {
        return;
    }

    refactor.success(`Filename: "${targetPath}" removed`);
}

function _getActionSaga(actionType) {
    switch (actionType) {
        case 'request':
            return 'doRequest';
        case 'submit':
            return 'doSubmit';
        case 'paginate':
            return 'doRequest';
    }
}

function _getFolderActionSaga(actionType) {
    switch (actionType) {
        case 'request':
            return 'request';
        case 'submit':
            return 'submit';
        case 'paginate':
            return 'request';
    }
}

function makeSagaName(name, actionType) {
    return _.camelCase('watch_' + name + '_' + actionType);
}

module.exports = {
    add,
    remove,
    removeEmptyFile,
    makeSagaName
};

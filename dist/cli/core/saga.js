'use strict';

var _ = require('lodash');
var tmpl = require('blueimp-tmpl');
var refactor = require('../refactor');

var _require = require('./action'),
    makeActionName = _require.makeActionName;

var _require2 = require('./constant'),
    makeConstantName = _require2.makeConstantName;

var _require3 = require('./constant'),
    makeConstantStateKeyName = _require3.makeConstantStateKeyName;

var CONSTANTS = require('../constants');
var prototype = require('../prototype/saga');

var FILENAME = 'sagas.js';

function init(feature) {
    var targetPath = refactor.getReduxFolder(feature) + '/' + FILENAME;
    refactor.save(targetPath, [""]);
    refactor.success(targetPath + ' was created');
}

function add(_ref) {
    var feature = _ref.feature,
        name = _ref.name,
        type = _ref.type,
        withSaga = _ref.withSaga;

    var reduxFolder = refactor.getReduxFolder(feature);

    if (!refactor.dirExists(reduxFolder + '/reducers')) {
        refactor.mkdir(reduxFolder + '/reducers');
    }

    var targetPath = reduxFolder + '/reducers/' + _.snakeCase(withSaga) + '.js';

    var lines = [];
    if (refactor.fileExists(targetPath)) {
        lines = refactor.getLines(targetPath);
    }

    var sagaName = makeSagaName(name, type);
    var constantName = makeConstantName(name);
    var constantStateKeyName = makeConstantStateKeyName(name);
    var actionName = makeActionName(name);
    var actionSaga = _getActionSaga(type);

    if (refactor.isStringMatch(lines.join(" "), new RegExp('(.+)export const ' + sagaName + '(.+)'))) {
        refactor.info('Saga: "' + sagaName + '" exists in "' + targetPath + '"');
        return;
    }

    var sagaCode = tmpl(prototype[type].code, {
        sagaName: sagaName,
        constantName: constantName,
        actionName: actionName,
        constantStateKeyName: constantStateKeyName,
        actionSaga: actionSaga,
        featureReducerKey: _.snakeCase(feature)
    });

    var i = refactor.lastLineIndex(lines, /^export const reducer/);
    if (-1 === i) {
        i = lines.length + 1;
    }

    refactor.writeLine(lines, i, sagaCode);
    refactor.save(targetPath, lines);

    refactor.updateFile(targetPath, function (ast) {
        return [].concat(refactor.addImportFrom(ast, 'redux-saga/effects', '', prototype[type].sagaImports), refactor.addImportFrom(ast, CONSTANTS.PACKAGE_NAME + '/api/' + _getFolderActionSaga(type) + '/saga', '', [actionSaga]), refactor.addImportFrom(ast, '../constants', '', [constantName]), refactor.addImportFrom(ast, '../actions', '', [actionName]));
    });

    if ('paginate' === type) {
        refactor.updateFile(targetPath, function (ast) {
            return [].concat(refactor.addImportFrom(ast, '../constants', '', [constantStateKeyName]));
        });
    }

    refactor.success('Saga: "' + sagaName + '" created in "' + targetPath + '"');
}

function remove(_ref2) {
    var feature = _ref2.feature,
        name = _ref2.name,
        type = _ref2.type,
        withSaga = _ref2.withSaga;

    var reduxFolder = refactor.getReduxFolder(feature);

    var targetPath = reduxFolder + '/reducers/' + _.snakeCase(withSaga) + '.js';
    if (!refactor.fileExists(targetPath)) {
        return;
    }

    var sagaName = makeSagaName(name, type);
    var constantName = makeConstantName(name);
    var constantStateKeyName = makeConstantStateKeyName(name);
    var actionName = makeActionName(name);

    refactor.updateFile(targetPath, function (ast) {
        return [].concat(refactor.removeExportSpecifier(ast, sagaName));
    });

    refactor.updateFile(targetPath, function (ast) {
        return [].concat(refactor.removeImportSpecifier(ast, _getActionSaga(type)), refactor.removeImportSpecifier(ast, [constantName, constantStateKeyName]), refactor.removeImportSpecifier(ast, actionName));
    });

    refactor.success('Saga: "' + sagaName + '" removed in "' + targetPath + '"');
}

function removeEmptyFile(_ref3) {
    var feature = _ref3.feature,
        withSaga = _ref3.withSaga;

    var reduxFolder = refactor.getReduxFolder(feature);
    var targetPath = reduxFolder + '/reducers/' + _.snakeCase(withSaga) + '.js';
    if (!refactor.fileExists(targetPath)) {
        return;
    }

    if (!refactor.removeFileWhichNoExported(targetPath)) {
        return;
    }

    refactor.success('Filename: "' + targetPath + '" removed');
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
    init: init,
    add: add,
    remove: remove,
    removeEmptyFile: removeEmptyFile,
    makeSagaName: makeSagaName,
    FILENAME: FILENAME
};
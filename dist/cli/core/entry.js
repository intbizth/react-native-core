'use strict';

var _ = require('lodash');
var refactor = require('../refactor');
var makeSagaName = require('./saga').makeSagaName;
var makeReducerName = require('./reducer').makeReducerName;

function linkSaga(_ref) {
    var feature = _ref.feature,
        name = _ref.name,
        type = _ref.type,
        withSaga = _ref.withSaga;

    var targetPath = refactor.getReduxFolder(feature) + '/sagas.js';
    var sagaName = makeSagaName(name, type);

    refactor.updateFile(targetPath, function (ast) {
        return [].concat(refactor.addExportFrom(ast, './reducers/' + _.snakeCase(withSaga), '', [sagaName]));
    });

    refactor.success('Saga: "' + sagaName + '" linked in "' + targetPath + '"');
}

function unlinkSaga(_ref2) {
    var feature = _ref2.feature,
        name = _ref2.name,
        type = _ref2.type;

    var targetPath = refactor.getReduxFolder(feature) + '/sagas.js';
    var sagaName = makeSagaName(name, type);

    refactor.updateFile(targetPath, function (ast) {
        return [].concat(refactor.removeExportSpecifier(ast, sagaName));
    });

    refactor.success('Saga: "' + sagaName + '" unlinked in "' + targetPath + '"');
}

function linkReducer(_ref3) {
    var feature = _ref3.feature,
        name = _ref3.name,
        withSaga = _ref3.withSaga;

    var targetPath = refactor.getReduxFolder(feature) + '/reducer.js';
    var reducerName = makeReducerName(name);

    refactor.updateFile(targetPath, function (ast) {
        return [].concat(refactor.addImportFrom(ast, './reducers/' + _.snakeCase(withSaga), '', [reducerName]), refactor.addToArray(ast, 'reducers', reducerName));
    });

    refactor.success('Reducer: "' + reducerName + '" linked in "' + targetPath + '"');
}

function unlinkReducer(_ref4) {
    var feature = _ref4.feature,
        name = _ref4.name;

    var targetPath = refactor.getReduxFolder(feature) + '/reducer.js';
    var reducerName = makeReducerName(name);

    refactor.updateFile(targetPath, function (ast) {
        return [].concat(refactor.removeImportSpecifier(ast, reducerName), refactor.removeFromArray(ast, 'reducers', reducerName));
    });

    refactor.success('Reducer: "' + reducerName + '" unlinked in "' + targetPath + '"');
}

module.exports = {
    linkSaga: linkSaga,
    unlinkSaga: unlinkSaga,
    linkReducer: linkReducer,
    unlinkReducer: unlinkReducer
};
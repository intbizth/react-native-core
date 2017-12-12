'use strict';

var _ = require('lodash');
var tmpl = require('blueimp-tmpl');
var refactor = require('../refactor');
var makeConstantStateKeyName = require('./constant').makeConstantStateKeyName;
var makeConstantName = require('./constant').makeConstantName;
var CONSTANTS = require('../constants');
var prototype = require('../prototype/reducer');

function add(_ref) {
    var feature = _ref.feature,
        name = _ref.name,
        type = _ref.type,
        withSaga = _ref.withSaga;

    var reduxFolder = refactor.getReduxFolder(feature);
    var targetPath = reduxFolder + '/reducers/' + _.snakeCase(withSaga) + '.js';
    var reducerName = makeReducerName(name);
    var reducer = _getReducerName(type);
    var constantName = makeConstantName(name);
    var constantStateKeyName = makeConstantStateKeyName(name);

    var reducerTpl = tmpl(prototype, {
        reducerName: reducerName,
        reducer: reducer,
        constantName: constantName,
        constantStateKeyName: constantStateKeyName
    });

    var lines = refactor.getLines(targetPath);

    if (refactor.isStringMatch(lines.join(" "), reducerTpl)) {
        refactor.info('Reducer: "' + reducerName + '" exists in "' + targetPath + '"');
        return;
    }

    refactor.writeLine(lines, lines.length + 1, reducerTpl);
    refactor.save(targetPath, lines);

    refactor.updateFile(targetPath, function (ast) {
        return [].concat(refactor.addImportFrom(ast, CONSTANTS.PACKAGE_NAME + '/api/' + type + '/reducer', reducer), refactor.addImportFrom(ast, '../constants', '', [constantName, constantStateKeyName]));
    });

    refactor.success('Reducer: "' + reducerName + '" created in "' + targetPath + '"');
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

    var reducer = _getReducerName(type);
    var reducerName = makeReducerName(name);
    var constantName = makeConstantName(name);
    var constantStateKeyName = makeConstantStateKeyName(name);
    var reducerTpl = tmpl(prototype, {
        reducerName: reducerName,
        reducer: reducer,
        constantName: constantName,
        constantStateKeyName: constantStateKeyName
    });

    var lines = refactor.getLines(targetPath);
    if (!refactor.isStringMatch(lines.join(" "), reducerTpl)) {
        return;
    }

    refactor.removeLines(lines, reducerTpl);
    refactor.save(targetPath, lines);

    refactor.updateFile(targetPath, function (ast) {
        return [].concat(refactor.removeImportSpecifier(ast, reducer), refactor.removeImportSpecifier(ast, [constantName, constantStateKeyName]));
    });

    refactor.success('Reducer: "' + reducerName + '" removed in "' + targetPath + '"');
}

function _getReducerName(actionType) {
    switch (actionType) {
        case 'request':
            return 'requestReducer';
        case 'submit':
            return 'submitReducer';
        case 'paginate':
            return 'indexReducer';
    }
}

function makeReducerName(name) {
    return _.camelCase(name + 'Reducer');
}

module.exports = {
    add: add,
    remove: remove,
    makeReducerName: makeReducerName
};
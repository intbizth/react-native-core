'use strict';

var _ = require('lodash');
var refactor = require('../refactor');
var CONSTANTS = require('../constants');
var tmpl = require('blueimp-tmpl');

var _require = require('./constant'),
    makeConstantStateKeyName = _require.makeConstantStateKeyName;

var prototype = require('../prototype/initialState');

var FILENAME = 'initialState.js';

function init(feature) {
    var targetPath = refactor.getReduxFolder(feature) + '/' + FILENAME;

    var lines = [];
    refactor.writeLine(lines, 0, tmpl(prototype.init, {}));
    refactor.save(targetPath, lines);

    refactor.success(targetPath + ' was created');
}

function add(_ref) {
    var feature = _ref.feature,
        name = _ref.name,
        type = _ref.type,
        withReducer = _ref.withReducer;

    if (!withReducer) {
        return;
    }

    var targetPath = refactor.getReduxFolder(feature) + '/' + FILENAME;
    var stateKeyName = makeConstantStateKeyName(name);

    var lines = refactor.getLines(targetPath);
    var i = refactor.lastLineIndex(lines, /^const initialState =/);
    if (-1 === i) {
        refactor.error(targetPath + ' const initialState is not defined');
    }

    if ('paginate' === type) {
        refactor.updateFile(targetPath, function (ast) {
            return [].concat(refactor.addImportFrom(ast, './constants', '', [stateKeyName]), refactor.addImportFrom(ast, CONSTANTS.PACKAGE_NAME + '/api/paginate/reducer', '', ['makeInitialState']), refactor.addObjectProperty(ast, 'initialState', '', '...makeInitialState(' + stateKeyName + ')'));
        });
    } else {
        refactor.updateFile(targetPath, function (ast) {
            return [].concat(refactor.addImportFrom(ast, './constants', '', [stateKeyName]), refactor.addObjectProperty(ast, 'initialState', '[' + stateKeyName + ']', 'null'));
        });
    }

    refactor.success('InitialState: "' + stateKeyName + '" created in "' + targetPath + '"');
}

function remove(_ref2) {
    var feature = _ref2.feature,
        name = _ref2.name,
        type = _ref2.type;

    var targetPath = refactor.getReduxFolder(feature) + '/' + FILENAME;
    var stateKeyName = makeConstantStateKeyName(name);

    if ('paginate' === type) {
        refactor.updateFile(targetPath, function (ast) {
            return [].concat(refactor.removeObjectProperty(ast, 'initialState', '...makeInitialState(' + stateKeyName + ')'));
        });
        refactor.updateFile(targetPath, function (ast) {
            return [].concat(refactor.removeImportSpecifier(ast, stateKeyName), refactor.removeImportSpecifier(ast, 'makeInitialState'));
        });
    } else {
        refactor.updateFile(targetPath, function (ast) {
            return [].concat(refactor.removeObjectProperty(ast, 'initialState', '[' + stateKeyName + ']'));
        });
        refactor.updateFile(targetPath, function (ast) {
            return [].concat(refactor.removeImportSpecifier(ast, stateKeyName));
        });
    }

    refactor.success('InitialState: "' + stateKeyName + '" removed in "' + targetPath + '"');
}

module.exports = {
    init: init,
    add: add,
    remove: remove,
    FILENAME: FILENAME
};
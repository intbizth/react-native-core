'use strict';

var _ = require('lodash');
var tmpl = require('blueimp-tmpl');
var refactor = require('../refactor');
var CONSTANTS = require('../constants');
var prototype = require('../prototype/constant');

function add(_ref) {
    var feature = _ref.feature,
        name = _ref.name,
        type = _ref.type,
        withReducer = _ref.withReducer;

    var constName = makeConstantName(name);
    var constCreator = _getFunc(type);
    var targetPath = refactor.getReduxFolder(feature) + '/constants.js';
    var lines = refactor.getLines(targetPath);
    var i = refactor.lastLineIndex(lines, /^export /);

    var constTpl = tmpl(prototype.constant, {
        constName: constName,
        constCreator: constCreator
    });
    if (!refactor.isStringMatch(lines.join(" "), constTpl)) {
        refactor.writeLine(lines, i + 1, constTpl);
        refactor.success('Constant: "' + constName + '" created in "' + targetPath + '"');
    }

    if (withReducer) {
        var constStateKeyName = makeConstantStateKeyName(name);
        var constWithReducerTpl = tmpl(prototype.constantWithReducer, {
            constName: constStateKeyName,
            stateKey: withReducer
        });
        if (!refactor.isStringMatch(lines.join(" "), constWithReducerTpl)) {
            refactor.writeLine(lines, i + 2, constWithReducerTpl);
            refactor.success('Constant: "' + constStateKeyName + '" created in "' + targetPath + '"');
        }
    }

    refactor.save(targetPath, lines);

    refactor.updateFile(targetPath, function (ast) {
        return [].concat(refactor.addImportFrom(ast, CONSTANTS.PACKAGE_NAME + '/api/' + type + '/action', '', [constCreator]));
    });
}

function remove(_ref2) {
    var feature = _ref2.feature,
        name = _ref2.name;

    var constName = makeConstantName(name);
    var constStateKeyName = makeConstantStateKeyName(name);
    var targetPath = refactor.getReduxFolder(feature) + '/constants.js';
    var lines = refactor.getLines(targetPath);

    var i = _.findIndex(lines, function (l) {
        return new RegExp('^export const ' + constName + ' = create').test(l);
    });
    if (-1 === i) {
        refactor.error('Not found action name "' + name + '"');
    }

    var type = '';
    _.forEach(['request', 'submit', 'paginate'], function (v) {
        if (-1 !== lines[i].indexOf(_getFunc(v))) {
            type = v;
        }
    });

    if ('' === type) {
        refactor.error('Not found action type');
    }

    var constCreator = _getFunc(type);

    var constTpl = tmpl(prototype.constant, {
        constName: constName,
        constCreator: constCreator
    });
    refactor.removeLines(lines, constTpl);
    refactor.removeLines(lines, new RegExp('^export const ' + constStateKeyName + ' ='));
    refactor.save(targetPath, lines);

    refactor.updateFile(targetPath, function (ast) {
        return [].concat(refactor.removeImportSpecifier(ast, [_getFunc(type)]));
    });

    refactor.success('Constant: "' + constName + '" removed in "' + targetPath + '"');
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

    refactor.error('Unexpected type ' + actionType);
}

function makeConstantName(name) {
    return _.toUpper(_.snakeCase(name));
}

function makeConstantStateKeyName(name) {
    return makeConstantName(name) + '_STATE_KEY';
}

module.exports = {
    add: add,
    remove: remove,
    makeConstantName: makeConstantName,
    makeConstantStateKeyName: makeConstantStateKeyName
};
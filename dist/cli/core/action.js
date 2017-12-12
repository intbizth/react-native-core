'use strict';

var _ = require('lodash');
var tmpl = require('blueimp-tmpl');
var refactor = require('../refactor');
var makeConstantName = require('./constant').makeConstantName;
var CONSTANTS = require('../constants');
var prototype = require('../prototype/action');

function add(_ref) {
    var feature = _ref.feature,
        name = _ref.name,
        type = _ref.type;

    var actionName = makeActionName(name);
    var actionCreator = _getFunc(type);
    var constantName = makeConstantName(name);
    var actionTpl = tmpl(prototype, { actionName: actionName, actionCreator: actionCreator, constantName: constantName });

    var targetPath = refactor.getReduxFolder(feature) + '/actions.js';
    var lines = refactor.getLines(targetPath);

    if (refactor.isStringMatch(lines.join(" "), actionTpl)) {
        refactor.info('Action: "' + actionName + '" exists in "' + targetPath + '"');
        return;
    }

    refactor.writeLine(lines, lines.length, actionTpl);
    refactor.save(targetPath, lines);

    refactor.updateFile(targetPath, function (ast) {
        return [].concat(refactor.addImportFrom(ast, CONSTANTS.PACKAGE_NAME + '/api/submit/action', '', [actionCreator]), refactor.addImportFrom(ast, './constants', '', [constantName]));
    });

    refactor.success('Action: "' + actionName + '" created in "' + targetPath + '"');
}

function remove(_ref2) {
    var feature = _ref2.feature,
        name = _ref2.name,
        type = _ref2.type;

    var actionName = makeActionName(name);
    var constantName = makeConstantName(name);
    var actionCreator = _getFunc(type);
    var actionTpl = tmpl(prototype, { actionName: actionName, actionCreator: actionCreator, constantName: constantName });

    var targetPath = refactor.getReduxFolder(feature) + '/actions.js';
    var lines = refactor.getLines(targetPath);

    refactor.removeLines(lines, actionTpl);
    refactor.save(targetPath, lines);

    refactor.updateFile(targetPath, function (ast) {
        return [].concat(refactor.removeImportSpecifier(ast, actionCreator), refactor.removeImportSpecifier(ast, constantName));
    });

    refactor.success('Action: "' + actionName + '" removed in "' + targetPath + '"');
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

    refactor.error('Unexpected type ' + actionType);
}

function makeActionName(name) {
    return _.camelCase(name);
}

module.exports = {
    add: add,
    remove: remove,
    makeActionName: makeActionName
};
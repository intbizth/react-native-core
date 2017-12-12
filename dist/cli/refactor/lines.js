'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _ = require('lodash');
var common = require('./common');
var utils = require('./utils');

function isStringMatch(str, match) {
    if (_.isString(match)) {
        return _.includes(str, match);
    } else if (_.isFunction(match)) {
        return match(str);
    }
    return match.test(str);
}

function lastLineIndex(lines, match) {
    if (_.isString(match)) {
        // String
        return _.findLastIndex(lines, function (l) {
            return l.indexOf(match) >= 0;
        });
    } else if (_.isFunction(match)) {
        // Callback
        return _.findLastIndex(lines, match);
    }

    // Regular expression
    return _.findLastIndex(lines, function (l) {
        return match.test(l);
    });
}

function writeLine(lines, fromLine, data) {
    var code = data;
    if (!_.isArray(code)) {
        if (!_.isString(code)) {
            utils.error('code must be string or array');
        }
        code = code.split('\n');
    }

    lines.splice.apply(lines, [fromLine, 0].concat(_toConsumableArray(code)));
    _resolveBlankLine(lines);
}

function removeLines(lines, str) {
    _.remove(lines, function (line) {
        return isStringMatch(line, str);
    });
    _resolveBlankLine(lines);
}

function _resolveBlankLine(lines) {
    function isEmptyLine(line) {
        line = line.replace(/\s/g, '');
        return '' === line;
    }

    if (!isEmptyLine(_.last(lines))) {
        lines.push("");
    }

    var length = lines.length;

    for (var i = length - 1; i >= 0; i--) {
        if (isEmptyLine(lines[i]) && !isEmptyLine(lines[i - 1])) {
            break;
        }

        lines.splice(i, 1);
    }
}

module.exports = {
    lastLineIndex: lastLineIndex,
    isStringMatch: isStringMatch,
    writeLine: common.acceptFilePathForLines(writeLine),
    removeLines: common.acceptFilePathForLines(removeLines)
};
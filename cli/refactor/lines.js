const _ = require('lodash');
const common = require('./common');
const utils = require('./utils');

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
        return _.findLastIndex(lines, l => l.indexOf(match) >= 0);
    } else if (_.isFunction(match)) {
        // Callback
        return _.findLastIndex(lines, match);
    }

    // Regular expression
    return _.findLastIndex(lines, l => match.test(l));
}

function writeLine(lines, fromLine, data) {
    let code = data;
    if (!_.isArray(code)) {
        if (!_.isString(code)) {
            utils.error(`code must be string or array`);
        }
        code = code.split('\n');
    }

    lines.splice(fromLine, 0,  ...code);
    _resolveBlankLine(lines);
}

function removeLines(lines, str) {
    _.remove(lines, line => isStringMatch(line, str));
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

    const length = lines.length;

    for (let i = length - 1; i >= 0; i--) {
        if (isEmptyLine(lines[i]) && !isEmptyLine(lines[i - 1])) {
            break;
        }

        lines.splice(i, 1);
    }
}

module.exports = {
    lastLineIndex,
    isStringMatch,
    writeLine: common.acceptFilePathForLines(writeLine),
    removeLines: common.acceptFilePathForLines(removeLines),
};

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
}

function removeLines(lines, str) {
    _.remove(lines, line => isStringMatch(line, str));
}

module.exports = {
    lastLineIndex,
    isStringMatch,
    writeLine: common.acceptFilePathForLines(writeLine),
    removeLines: common.acceptFilePathForLines(removeLines),
};

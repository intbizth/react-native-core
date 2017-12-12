'use strict';

var _ = require('lodash');
var traverse = require('babel-traverse').default;
var common = require('./common');
var utils = require('./utils');
var vio = require('./vio');

/**
 * Find the nearest char index before given index. skip white space strings
 * If not found, return -1
 * eg: nearestCharBefore(',', '1,    2, 3', 4) => 1
 * @param {string} char - Which char to find
 * @param {string} str - The string to to search.
 * @index {number} index - From which index start to find
 * @
 **/
function nearestCharBefore(char, str, index) {
    // Find the nearest char index before given index. skip white space strings
    // If not found, return -1
    // eg: nearestCharBefore(',', '1,    2, 3', 4) => 1
    var i = index - 1;
    while (i >= 0) {
        if (str.charAt(i) === char) return i;
        if (!/\s/.test(str.charAt(i))) return -1;
        i -= 1;
    }
    return -1;
}

/**
 * Similar with nearestCharBefore, but find the char after the given index.
 * If not found, return -1
 * @param {string} char - Which char to find
 * @param {string} str - The string to to search.
 * @index {number} index - From which index start to find
 * @
 **/
function nearestCharAfter(char, str, index) {
    // Find the nearest char index before given index. skip white space strings
    // If not found, return -1
    var i = index + 1;
    while (i < str.length) {
        if (str.charAt(i) === char) return i;
        if (!/\s/.test(str.charAt(i))) return -1;
        i += 1;
    }
    return -1;
}

/**
 * Add an element to an array definition.
 * @param {object} node - The ast node of the array definition.
 * @param {string} code - The code to append to the array.
 * @alias module:refactor.addToArrayByNode
 * @
 **/
function addToArrayByNode(node, code) {
    // node: the arr expression node
    // code: added as the last element of the array

    var multilines = node.loc.start.line !== node.loc.end.line;
    var insertPos = node.start + 1; // insert after '['

    if (node.elements.length) {
        var ele = _.last(node.elements);
        insertPos = ele.end;
    }

    // if exlists key
    if (_.find(node.elements, { name: code })) {
        return [];
    }

    var replacement = void 0;
    if (multilines) {
        var indent = _.repeat(' ', 2);

        replacement = '\n' + indent + '  ' + code;
        if (node.elements.length) {
            replacement = ',' + replacement;
        } else {
            replacement = replacement + ',';
        }
    } else {
        replacement = code;
        if (node.elements.length > 0) {
            replacement = ', ' + code;
        }
    }
    return [{
        start: insertPos,
        end: insertPos,
        replacement: replacement
    }];
}

function addToArray(ast, varName, identifierName) {
    var changes = [];
    traverse(ast, {
        VariableDeclarator: function VariableDeclarator(path) {
            var node = path.node;
            if (_.get(node, 'id.name') !== varName || _.get(node, 'init.type') !== 'ArrayExpression') return;
            node.init._filePath = ast._filePath;
            changes = addToArrayByNode(node.init, identifierName);
            path.stop();
        }
    });
    return changes;
}

/**
 * Remove an element from an array definition.
 * @param {object} node - The ast node of the array definition.
 * @param {object} eleNode - The ast node to be removed.
 * @alias module:refactor.removeFromArrayByNode
 * @
 **/
function removeFromArrayByNode(node, eleNode) {
    var elements = node.elements;

    if (!elements.includes(eleNode)) {
        utils.info('Failed to find element when trying to remove element from array.');
        return [];
    }

    if (!node._filePath) {
        utils.error('No _filePath property found on node when removing element from array');
        return null;
    }

    var content = vio.getContent(node._filePath);
    var startPos = nearestCharBefore(',', content, eleNode.start);
    if (startPos < 0) {
        // it's the first element
        startPos = node.start + 1;
    }

    var endPos = eleNode.end;

    if (elements.length === 1) {
        // if the element is the only element, try to remove the trailing comma if exists
        var nextComma = nearestCharAfter(',', content, endPos - 1);
        if (nextComma >= 0) endPos = nextComma + 1;
    }

    return [{
        start: startPos,
        end: endPos,
        replacement: ''
    }];
}

function removeFromArray(ast, varName, identifierName) {
    var changes = [];
    traverse(ast, {
        VariableDeclarator: function VariableDeclarator(path) {
            var node = path.node;
            if (_.get(node, 'id.name') !== varName || _.get(node, 'init.type') !== 'ArrayExpression') return;
            node.init._filePath = ast._filePath;
            var toRemove = _.find(node.init.elements, function (ele) {
                return ele.name === identifierName || ele.value === identifierName;
            });
            changes = removeFromArrayByNode(node.init, toRemove);
            path.stop();
        }
    });
    return changes;
}

module.exports = {
    addToArray: common.acceptFilePathForAst(addToArray),
    removeFromArray: common.acceptFilePathForAst(removeFromArray)
};
const _ = require('lodash');
const traverse = require('babel-traverse').default;
const common = require('./common');
const utils = require('./utils');
const vio = require('./vio');

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
    let i = index - 1;
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
    let i = index + 1;
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

    const multilines = node.loc.start.line !== node.loc.end.line;
    let insertPos = node.start + 1; // insert after '['

    if (node.elements.length) {
        const ele = _.last(node.elements);
        insertPos = ele.end;
    }

    // if exlists key
    if(_.find(node.elements, {name: code})) {
        return [];
    }

    let replacement;
    if (multilines) {
        const indent = _.repeat(' ', 2);

        replacement = `\n${indent}  ${code}`;
        if (node.elements.length) {
            replacement = `,${replacement}`;
        } else {
            replacement = `${replacement},`;
        }
    } else {
        replacement = code;
        if (node.elements.length > 0) {
            replacement = `, ${code}`;
        }
    }
    return [{
        start: insertPos,
        end: insertPos,
        replacement,
    }];
}

function addToArray(ast, varName, identifierName) {
    let changes = [];
    traverse(ast, {
        VariableDeclarator(path) {
            const node = path.node;
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
    const elements = node.elements;

    if (!elements.includes(eleNode)) {
        utils.info('Failed to find element when trying to remove element from array.');
        return [];
    }

    if (!node._filePath) {
        utils.error('No _filePath property found on node when removing element from array');
        return null;
    }

    const content = vio.getContent(node._filePath);
    let startPos = nearestCharBefore(',', content, eleNode.start);
    if (startPos < 0) {
        // it's the first element
        startPos = node.start + 1;
    }

    let endPos = eleNode.end;

    if (elements.length === 1) {
        // if the element is the only element, try to remove the trailing comma if exists
        const nextComma = nearestCharAfter(',', content, endPos - 1);
        if (nextComma >= 0) endPos = nextComma + 1;
    }

    return [{
        start: startPos,
        end: endPos,
        replacement: '',
    }];
}

function removeFromArray(ast, varName, identifierName) {
    let changes = [];
    traverse(ast, {
        VariableDeclarator(path) {
            const node = path.node;
            if (_.get(node, 'id.name') !== varName || _.get(node, 'init.type') !== 'ArrayExpression') return;
            node.init._filePath = ast._filePath;
            const toRemove = _.find(node.init.elements, ele => ele.name === identifierName);
            changes = removeFromArrayByNode(node.init, toRemove);
            path.stop();
        }
    });
    return changes;
}

module.exports = {
    addToArray: common.acceptFilePathForAst(addToArray),
    removeFromArray: common.acceptFilePathForAst(removeFromArray),
};

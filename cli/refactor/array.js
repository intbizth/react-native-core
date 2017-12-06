const _ = require('lodash');
const traverse = require('babel-traverse').default;
const common = require('./common');

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

module.exports = {
    addToArray: common.acceptFilePathForAst(addToArray),
};

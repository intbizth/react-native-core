const _ = require('lodash');
const traverse = require('babel-traverse').default;
const common = require('./common');

function addObjectProperty(ast, varName, propName, propValue) {
    const changes = [];
    traverse(ast, {
        VariableDeclarator(path) {
            const node = path.node;
            if ((varName && _.get(node, 'id.name') !== varName) || _.get(node, 'init.type') !== 'ObjectExpression') return;
            const props = _.get(node, 'init.properties');

            const multilines = node.loc.start.line !== node.loc.end.line;
            // Check if it exists
            const targetPropNode = _.find(props, p =>
            _.get(p, 'key.type') === 'Identifier'
            && (_.get(p, 'key.name') === propName
            || _.get(p, 'key.name') === propName.replace(/[\[\]]+/g, '')) // [Dynamic key]
            );
            if (!targetPropNode) {
                const targetPos = node.end - 1;

                if (multilines) {
                    const indent = _.repeat(' ', 2);
                    changes.push({
                        start: targetPos,
                        end: targetPos,
                        replacement: `${indent}  ${propName}${(propName ? ': ': '')}${propValue},\n`,
                    });
                } else {
                    changes.push({
                        start: targetPos,
                        end: targetPos,
                        replacement: `${props.length ? ', ' : ' '}${(propName ? ':': '')} ${propValue} `,
                    });
                }
            } else {
                console.log(`Property name '${propName}' already exists for ${varName}.`);
            }
        },
    });
    return changes;
}

module.exports = {
    addObjectProperty: common.acceptFilePathForAst(addObjectProperty)
};

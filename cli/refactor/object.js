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

function removeObjectProperty(ast, varName, propName) {
    const changes = [];
    traverse(ast, {
        VariableDeclarator(path) {
            const node = path.node;

            if ((varName && _.get(node, 'id.name') !== varName) || _.get(node, 'init.type') !== 'ObjectExpression') return;
            const props = _.get(node, 'init.properties');

            const multilines = node.loc.start.line !== node.loc.end.line;

            const targetPropNode = _.find(props, p => {
                return(_.get(p, 'key.type') === 'Identifier' && (_.get(p, 'key.name') === propName || _.get(p, 'key.name') === propName.replace(/[\[\]]+/g, '')))
                || propName === `...${_.get(p, 'argument.callee.name')}(${_.get(p, 'argument.arguments.0.name')})`
            });

            if (targetPropNode) {
                const targetIndex = _.indexOf(props, targetPropNode);
                let startIndex;
                let endIndex;
                if (targetIndex > 0) {
                    startIndex = props[targetIndex - 1].end;
                    endIndex = targetPropNode.end;
                } else {
                    startIndex = node.init.start + 1;
                    endIndex = targetPropNode.end + (multilines || targetIndex < props.length - 1 ? 1 : 0);
                }
                changes.push({
                    start: startIndex,
                    end: endIndex,
                    replacement: '',
                });
            }
        },
    });
    return changes;
}

module.exports = {
    addObjectProperty: common.acceptFilePathForAst(addObjectProperty),
    removeObjectProperty: common.acceptFilePathForAst(removeObjectProperty)
};

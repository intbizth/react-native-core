'use strict';

var _ = require('lodash');
var traverse = require('babel-traverse').default;
var common = require('./common');

function addObjectProperty(ast, varName, propName, propValue) {
    var changes = [];
    traverse(ast, {
        VariableDeclarator: function VariableDeclarator(path) {
            var node = path.node;
            if (varName && _.get(node, 'id.name') !== varName || _.get(node, 'init.type') !== 'ObjectExpression') return;
            var props = _.get(node, 'init.properties');

            var multilines = node.loc.start.line !== node.loc.end.line;
            // Check if it exists
            var targetPropNode = _.find(props, function (p) {
                return _.get(p, 'key.type') === 'Identifier' && (_.get(p, 'key.name') === propName || _.get(p, 'key.name') === propName.replace(/[\[\]]+/g, ''));
            } // [Dynamic key]
            );
            if (!targetPropNode) {
                var targetPos = node.end - 1;

                if (multilines) {
                    var indent = _.repeat(' ', 2);
                    changes.push({
                        start: targetPos,
                        end: targetPos,
                        replacement: indent + '  ' + propName + (propName ? ': ' : '') + propValue + ',\n'
                    });
                } else {
                    // remove space in last object value such: { p:1, p:2 } => { p:1, p:2, p:3 } not { p:1, p:2 , p:3 }
                    var start = targetPos;
                    if (_.get(_.last(props), 'value.end') !== targetPos) {
                        start--;
                    }

                    changes.push({
                        start: start,
                        end: targetPos,
                        replacement: '' + (props.length ? ', ' : ' ') + (propName ? propName + ':' : '') + ' ' + propValue + ' '
                    });
                }
            } else {
                console.log('Property name \'' + propName + '\' already exists for ' + varName + '.');
            }
        }
    });
    return changes;
}

function removeObjectProperty(ast, varName, propName) {
    var changes = [];
    traverse(ast, {
        VariableDeclarator: function VariableDeclarator(path) {
            var node = path.node;

            if (varName && _.get(node, 'id.name') !== varName || _.get(node, 'init.type') !== 'ObjectExpression') return;
            var props = _.get(node, 'init.properties');

            var multilines = node.loc.start.line !== node.loc.end.line;

            var targetPropNode = _.find(props, function (p) {
                return _.get(p, 'key.type') === 'Identifier' && (_.get(p, 'key.name') === propName || _.get(p, 'key.name') === propName.replace(/[\[\]]+/g, '')) || propName === '...' + _.get(p, 'argument.callee.name') + '(' + _.get(p, 'argument.arguments.0.name') + ')';
            });

            if (targetPropNode) {
                var targetIndex = _.indexOf(props, targetPropNode);
                var startIndex = void 0;
                var endIndex = void 0;
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
                    replacement: ''
                });
            }
        }
    });
    return changes;
}

module.exports = {
    addObjectProperty: common.acceptFilePathForAst(addObjectProperty),
    removeObjectProperty: common.acceptFilePathForAst(removeObjectProperty)
};
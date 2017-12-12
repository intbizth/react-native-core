'use strict';

var _ = require('lodash');
var traverse = require('babel-traverse').default;
var vio = require('./vio');

function removeFileWhichNoExported(targetPath) {
    var shouldDelete = true;
    var ast = vio.getAst(targetPath);
    traverse(ast, {
        ExportNamedDeclaration: function ExportNamedDeclaration() {
            shouldDelete = false;
        }
    });

    if (shouldDelete) {
        vio.del(targetPath);
    }

    return shouldDelete;
}

module.exports = {
    removeFileWhichNoExported: removeFileWhichNoExported
};
const _ = require('lodash');
const traverse = require('babel-traverse').default;
const vio = require('./vio');

function removeFileWhichNoExported(targetPath) {
    let shouldDelete = true;
    const ast = vio.getAst(targetPath);
    traverse(ast, {
        ExportNamedDeclaration() {
            shouldDelete = false;
        }
    });

    if (shouldDelete) {
        vio.del(targetPath);
    }

    return shouldDelete;
}

module.exports = {
    removeFileWhichNoExported
};

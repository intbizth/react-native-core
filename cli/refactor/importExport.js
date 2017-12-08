
const _ = require('lodash');
const traverse = require('babel-traverse').default;
const generate = require('babel-generator').default;
const babelTypes = require('babel-types');
const common = require('./common');

const babelGeneratorOptions = {
    quotes: 'single',
};

function formatMultilineImport(importCode) {
    // format import statement to:
    // import {
    //   name1,
    //   name2,
    // } from './xxx';

    const m = importCode.match(/\{([^}]+)\}/);
    if (m) {
        const arr = _.compact(m[1].split(/, */).map(_.trim));
        if (arr.length) {
            return importCode.replace(/\{[^}]+\}/, `{\n    ${arr.join(',\n    ')},\n}`);
        }
    }
    return importCode;
}

/**
 * Import from a given module source. This methods operates import statement:
 * import defaultImmport, { namedImport ... } from './module-source';
 * It noly supports es6 modules import but not commonJS or AMD or others...
 * @param {string} ast - Which module to manage import statement.
 * @param {string} moduleSource - From which module source to add import from. If not found, the create an import line.
 * @index {string} defaultImport - The default import. If not need, pass it as null. The module should haven't import the default.
 * @index {string|array} namedImport - The named imports. If has imported, then do nothing.
 * @index {string} namespaceImport - The new function name.
 * @alias module:refactor.addImportFrom
 * @example
 * const refactor = require('rekit-core').refactor;
 * refactor.addImportFrom(file, './some-module', 'SomeModule', ['method1', 'method2']);
 * // it generates: import SomeModule, { method1, method2 } from './some-module';
 **/
function addImportFrom(ast, moduleSource, defaultImport, namedImport, namespaceImport) {
    // Summary:
    //  Add import from source module. Such as import { xxx } from './x';
    let names = [];

    if (namedImport) {
        if (typeof namedImport === 'string') {
            names.push(namedImport);
        } else {
            names = names.concat(namedImport);
        }
    }

    const changes = [];
    const t = babelTypes;

    let targetImportPos = 0;
    let sourceExisted = false;
    traverse(ast, {
        ImportDeclaration(path) {
            const node = path.node;
            // multilines means whether to separate import specifiers into different lines
            const multilines = node.loc.start.line !== node.loc.end.line;
            targetImportPos = path.node.end + 1;

            if (!node.specifiers || !node.source || node.source.value !== moduleSource) return;
            sourceExisted = true;
            let newNames = [];
            const alreadyHaveDefaultImport = !!_.find(node.specifiers, { type: 'ImportDefaultSpecifier' });
            const alreadyHaveNamespaceImport = !!_.find(node.specifiers, { type: 'ImportNamespaceSpecifier' });
            if (defaultImport && !alreadyHaveDefaultImport) newNames.push(defaultImport);
            if (namespaceImport && !alreadyHaveNamespaceImport) newNames.push(namespaceImport);

            newNames = newNames.concat(names);

            // only add names which don't exist
            newNames = newNames.filter(n => !_.find(node.specifiers, s => s.local.name === n));

            if (newNames.length > 0) {
                const newSpecifiers = [].concat(node.specifiers);
                newNames.forEach((n) => {
                    const local = t.identifier(n);
                    const imported = local; // TODO: doesn't support local alias.
                    if (n === defaultImport) {
                        newSpecifiers.unshift(t.importDefaultSpecifier(local));
                    } else if (n === namespaceImport) {
                        newSpecifiers.push(t.importNamespaceSpecifier(local));
                    } else {
                        newSpecifiers.push(t.importSpecifier(local, imported));
                    }
                });

                const newNode = Object.assign({}, node, { specifiers: newSpecifiers });
                let newCode = generate(newNode, babelGeneratorOptions).code;

                if (multilines) {
                    newCode = formatMultilineImport(newCode);
                }
                changes.push({
                    start: node.start,
                    end: node.end,
                    replacement: newCode,
                });
            }
        }
    });

    if (changes.length === 0 && !sourceExisted) {
        // add new import declaration if module source doesn't exist
        const specifiers = [];
        if (defaultImport) {
            specifiers.push(t.importDefaultSpecifier(t.identifier(defaultImport)));
        }
        if (namespaceImport) {
            specifiers.push(t.importNamespaceSpecifier(t.identifier(namespaceImport)));
        }

        names.forEach((n) => {
            const local = t.identifier(n);
            const imported = local;
            specifiers.push(t.importSpecifier(local, imported));
        });

        const node = t.importDeclaration(specifiers, t.stringLiteral(moduleSource));
        const code = generate(node, babelGeneratorOptions).code;
        changes.push({
            start: targetImportPos,
            end: targetImportPos,
            replacement: `${code}\n`,
        });
    }

    return changes;
}

/**
 * Export from a given module source. This methods operates export ... from statement:
 * @param {string} ast - Which module to manage export from statement.
 * @param {string} moduleSource - From which module source to add import from. If not found, the create an import line.
 * @index {string} defaultExport - The default import. If not need, pass it as null. The module should haven't import the default.
 * @index {string|array} namedExport - The named imports. If has imported, then do nothing.
 * @alias module:refactor.addExportFrom
 **/
function addExportFrom(ast, moduleSource, defaultExport, namedExport) {
    // Summary:
    //  Add export from source module. Such as export { xxx } from './x';
    let names = [];

    if (namedExport) {
        if (typeof namedExport === 'string') {
            names.push(namedExport);
        } else {
            names = names.concat(namedExport);
        }
    }

    const changes = [];
    const t = babelTypes;

    let targetExportPos = 0;
    let sourceExisted = false;
    traverse(ast, {
        ExportNamedDeclaration(path) {
            const node = path.node;
            targetExportPos = path.node.end + 1;
            if (!node.specifiers || !node.source || node.source.value !== moduleSource) return;
            sourceExisted = true;
            let newNames = [];
            const alreadyHaveDefaultExport = !!_.find(node.specifiers, s => _.get(s, 'local.name') === 'default');
            if (defaultExport && !alreadyHaveDefaultExport) newNames.push(defaultExport);

            newNames = newNames.concat(names);

            // only add names which don't exist
            newNames = newNames.filter(n => !_.find(node.specifiers, s => (_.get(s, 'exported.name') || _.get(s, 'local.name')) === n));

            if (newNames.length > 0) {
                const newSpecifiers = [].concat(node.specifiers);
                newNames.forEach((n) => {
                    const local = t.identifier(n);
                    const exported = local; // TODO: doesn't support local alias.
                    if (n === defaultExport) {
                        newSpecifiers.unshift(t.exportSpecifier(t.identifier('default'), exported));
                    } else {
                        newSpecifiers.push(t.exportSpecifier(local, exported));
                    }
                });

                const newNode = Object.assign({}, node, { specifiers: newSpecifiers });
                const newCode = generate(newNode, babelGeneratorOptions).code;
                changes.push({
                    start: node.start,
                    end: node.end,
                    replacement: newCode,
                });
            }
        }
    });

    if (changes.length === 0 && !sourceExisted) {
        const specifiers = [];
        if (defaultExport) {
            specifiers.push(t.exportSpecifier(t.identifier('default'), t.identifier(defaultExport)));
        }

        names.forEach((n) => {
            const local = t.identifier(n);
            const exported = local;
            specifiers.push(t.exportSpecifier(local, exported));
        });

        const node = t.ExportNamedDeclaration(null, specifiers, t.stringLiteral(moduleSource));
        const code = generate(node, babelGeneratorOptions).code;
        changes.push({
            start: targetExportPos,
            end: targetExportPos,
            replacement: `${code}\n`,
        });
    }

    return changes;
}

function removeImportSpecifier(ast, name) {
    // Remove import specifier by local name

    let names = name;
    if (typeof name === 'string') {
        names = [name];
    }
    const changes = [];
    let shouldRemove = true;
    traverse(ast, {
        CallExpression(path) {
            if (names[0] === _.get(path, 'node.callee.name')) {
                shouldRemove = false;
            }
        },
        ImportDeclaration(path) {
            const node = path.node;
            const multilines = node.loc.start.line !== node.loc.end.line;

            if (!node.specifiers) return;
            const newSpecifiers = node.specifiers.filter(s => !names.includes(s.local.name));
            if (newSpecifiers.length === 0) {
                // no specifiers, should delete the import statement
                changes.push({
                    start: node.start,
                    end: node.end,
                    replacement: '',
                });
            } else if (newSpecifiers.length !== node.specifiers.length) {
                // remove the specifier import
                const newNode = Object.assign({}, node, { specifiers: newSpecifiers });
                let newCode = generate(newNode, {}).code;
                if (multilines) newCode = formatMultilineImport(newCode);
                changes.push({
                    start: node.start,
                    end: node.end,
                    replacement: newCode,
                });
            }
        }
    });

    if (false === shouldRemove) {
        return [];
    }

    return changes;
}

function removeExportSpecifier(ast, name) {
    const changes = [];
    traverse(ast, {
        ExportNamedDeclaration(path) {
            const node = path.node;
            const multilines = node.loc.start.line !== node.loc.end.line;

            // case object
            if (!node.declaration && node.specifiers) {
                const newSpecifiers = _.filter(node.specifiers, (spec) => {
                    return name !== _.get(spec, 'local.name');
                });

                if (newSpecifiers.length === 0) {
                    // no specifiers, should delete the import statement
                    changes.push({
                        start: node.start,
                        end: node.end,
                        replacement: '',
                    });

                    return;
                }

                if (newSpecifiers.length === node.specifiers.length) {
                    return;
                }

                const newNode = Object.assign({}, node, { specifiers: newSpecifiers });
                let newCode = generate(newNode, {}).code;
                if (multilines) newCode = formatMultilineImport(newCode);
                changes.push({
                    start: node.start,
                    end: node.end,
                    replacement: newCode,
                });

                return;
            }


            // case function
            if (node.declaration && 'FunctionDeclaration' === node.declaration.type) {
                if(name === _.get(node.declaration, 'id.name')) {
                    changes.push({
                        start: node.start,
                        end: node.end,
                        replacement: '',
                    });
                }
                return;
            }

            // case const
            if (node.declaration) {
                _.forEach(node.declaration.declarations, (declaration) => {
                    if(name === _.get(declaration, 'id.name')) {
                        changes.push({
                            start: node.start,
                            end: node.end,
                            replacement: '',
                        });
                    }
                });
                return;
            }
        }
    });

    return changes;
}

module.exports = {
    addImportFrom: common.acceptFilePathForAst(addImportFrom),
    addExportFrom: common.acceptFilePathForAst(addExportFrom),
    removeImportSpecifier: common.acceptFilePathForAst(removeImportSpecifier),
    removeExportSpecifier: common.acceptFilePathForAst(removeExportSpecifier),
};

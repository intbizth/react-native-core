const _ = require('lodash');
const shell = require('shelljs');
const babylon = require('babylon');
const colors = require('colors/safe');

let fileLines = {};
let mvs = {}; // Files to move
let mvDirs = {}; // Folders to move
let asts = {};
let toSave = {};
let dirs = {};

function getLines(filePath) {
    if (_.isArray(filePath)) {
        // If it's already lines, return the arg.
        return filePath;
    }

    if (!fileLines[filePath]) {
        // if the file is moved, find the real file path
        let realFilePath = _.findKey(mvs, s => s === filePath) || filePath;
        // if dir is moved, find the original file path
        Object.keys(mvDirs).forEach((oldDir) => {
            if (_.startsWith(realFilePath, mvDirs[oldDir])) {
                realFilePath = realFilePath.replace(mvDirs[oldDir], oldDir);
            }
        });

        if (!shell.test('-e', realFilePath)) {
            console.log(colors.red('Can\'t find such file: ' + realFilePath));
            throw new Error;
        }
        fileLines[filePath] = shell.cat(realFilePath).split(/\r?\n/);
    }
    return fileLines[filePath];
}

function getContent(filePath) {
    return getLines(filePath).join('\n');
}

function getAst(filePath) {
    if (!asts[filePath]) {
        const code = getLines(filePath).join('\n');
        try {
            const ast = babylon.parse(code, {
                // parse in strict mode and allow module declarations
                sourceType: 'module',
                plugins: [
                    'jsx',
                    'flow',
                    'doExpressions',
                    'objectRestSpread',
                    'decorators',
                    'classProperties',
                    'exportExtensions',
                    'asyncGenerators',
                    'functionBind',
                    'functionSent',
                    'dynamicImport'
                ]
            });
            if (!ast) {
                console.log(colors.red(`Error: failed to parse ${filePath}, please check syntax.`));
                throw new Error;
            }
            asts[filePath] = ast;
            ast._filePath = filePath;
        } catch (e) {
            console.log(code);
            console.log(colors.red(`Error: failed to parse ${filePath}, please check syntax.`));
            throw new Error;
        }
    }
    return asts[filePath];
}

function save(filePath, lines) {
    if (_.isString(lines) || _.isArray(lines)) {
        put(filePath, lines);
    }
    toSave[filePath] = true;
}

function put(filePath, lines) {
    if (typeof lines === 'string') lines = lines.split(/\r?\n/);
    fileLines[filePath] = lines;
    delete asts[filePath]; // ast needs to be updated
}

function fileExists(filePath) {
    return (!!fileLines[filePath] || !!toSave[filePath]) || shell.test('-e', filePath);
}

function mkdir(dir) {
    dirs[dir] = true;
}

function dirExists(dir) {
    return !!dirs[dir] || shell.test('-e', dir);
}

function flush() {
    const res = [];

    Object.keys(dirs).forEach((dir) => {
        if (!shell.test('-e', dir)) {
            shell.mkdir('-p', dir);
        }
    });

    // Create/update files
    Object.keys(toSave).forEach((filePath) => {
        const newContent = getLines(filePath).join('\n');
        if (shell.test('-e', filePath)) {
            const oldContent = shell.cat(filePath).split(/\r?\n/).join('\n');
            if (oldContent === newContent) {
                return;
            }
        }
        shell.ShellString(newContent).to(filePath);
    });

    return res;
}

module.exports = {
    getContent,
    getLines,
    getAst,
    save,
    mkdir,
    dirExists,
    fileExists,
    flush
};

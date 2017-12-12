'use strict';

var _ = require('lodash');
var shell = require('shelljs');
var babylon = require('babylon');
var utils = require('./utils');

var fileLines = {};
var toDel = {};
var mvs = {}; // Files to move
var mvDirs = {}; // Folders to move
var asts = {};
var toSave = {};
var dirs = {};

function getLines(filePath) {
    if (_.isArray(filePath)) {
        // If it's already lines, return the arg.
        return filePath;
    }

    if (!fileLines[filePath]) {
        // if the file is moved, find the real file path
        var realFilePath = _.findKey(mvs, function (s) {
            return s === filePath;
        }) || filePath;
        // if dir is moved, find the original file path
        Object.keys(mvDirs).forEach(function (oldDir) {
            if (_.startsWith(realFilePath, mvDirs[oldDir])) {
                realFilePath = realFilePath.replace(mvDirs[oldDir], oldDir);
            }
        });

        if (!shell.test('-e', realFilePath)) {
            utils.error('Can\'t find such file: ' + realFilePath);
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
        var code = getLines(filePath).join('\n');
        try {
            var ast = babylon.parse(code, {
                // parse in strict mode and allow module declarations
                sourceType: 'module',
                plugins: ['jsx', 'flow', 'doExpressions', 'objectRestSpread', 'decorators', 'classProperties', 'exportExtensions', 'asyncGenerators', 'functionBind', 'functionSent', 'dynamicImport']
            });
            if (!ast) {
                utils.error('Error: failed to parse ' + filePath + ', please check syntax.');
            }
            asts[filePath] = ast;
            ast._filePath = filePath;
        } catch (e) {
            console.log(code);
            utils.error('Error: failed to parse ' + filePath + ', please check syntax.');
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

function del(filePath) {
    toDel[filePath] = true;
}

function put(filePath, lines) {
    if (typeof lines === 'string') lines = lines.split(/\r?\n/);
    fileLines[filePath] = lines;
    delete asts[filePath]; // ast needs to be updated
}

function fileExists(filePath) {
    return (!!fileLines[filePath] || !!toSave[filePath]) && !toDel[filePath] || shell.test('-e', filePath);
}

function mkdir(dir) {
    dirs[dir] = true;
}

function dirExists(dir) {
    return !!dirs[dir] && !toDel[dir] || shell.test('-e', dir);
}

function flush() {
    var res = [];

    Object.keys(dirs).forEach(function (dir) {
        if (!shell.test('-e', dir)) {
            shell.mkdir('-p', dir);
        }
    });

    // Create/update files
    Object.keys(toSave).forEach(function (filePath) {
        var newContent = getLines(filePath).join('\n');
        if (shell.test('-e', filePath)) {
            var oldContent = shell.cat(filePath).split(/\r?\n/).join('\n');
            if (oldContent === newContent) {
                return;
            }
        }
        shell.ShellString(newContent).to(filePath);
    });

    // Delete files
    Object.keys(toDel).forEach(function (filePath) {
        if (!shell.test('-e', filePath)) {
            utils.info('Warning: no file to delete: ', 'yellow', filePath);
        } else {
            shell.rm('-rf', filePath);
        }
    });

    return res;
}

function reset() {
    // Cant use obj = {} because mutation
    Object.keys(fileLines).forEach(function (key) {
        delete fileLines[key];
    });
    Object.keys(toDel).forEach(function (key) {
        delete toDel[key];
    });
    Object.keys(toSave).forEach(function (key) {
        delete toSave[key];
    });
    Object.keys(asts).forEach(function (key) {
        delete asts[key];
    });
    Object.keys(dirs).forEach(function (key) {
        delete dirs[key];
    });
    Object.keys(mvDirs).forEach(function (key) {
        delete mvDirs[key];
    });
    Object.keys(mvs).forEach(function (key) {
        delete mvs[key];
    });
}

module.exports = {
    getContent: getContent,
    getLines: getLines,
    getAst: getAst,
    save: save,
    del: del,
    mkdir: mkdir,
    dirExists: dirExists,
    fileExists: fileExists,
    flush: flush,
    reset: reset,

    // export for test case
    fileLines: fileLines,
    toDel: toDel,
    toSave: toSave,
    asts: asts,
    dirs: dirs,
    mvDirs: mvDirs,
    mvs: mvs
};
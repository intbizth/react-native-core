/* eslint-disable */
const _ = require('lodash');
const fs = require('fs');
const refactor = require('../cli/refactor');

function getAstAndCode(filePath) {
    return {
        code: refactor.getContent(filePath),
        ast: refactor.getAst(filePath)
    }
}

function walkSync(dir, filelist, needle) {
    const files = fs.readdirSync(dir);

    filelist = filelist || [];
    files.forEach(function(file) {
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            filelist = walkSync(dir + '/' + file, filelist, needle);
        }
        else {
            if (needle === file) {
                filelist.push(dir + '/' + file);
            }
        }
    });
    return filelist;
}

module.exports = {
    getAstAndCode,
    walkSync
};

require('./src/cli').test();

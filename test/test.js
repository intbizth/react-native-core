/* eslint-disable */
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
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

// describe('Command line tools', () => {
//     describe('Refactor function', () => {
//         describe('Array.js#AddToArray', () => {
//             it('should return a string contains new item', () => {
//                 const source = _getAstAndCode(path.join(__dirname, '/mock/array/add-to-array/single-line/source.js'));
//                 const expect = _getAstAndCode(path.join(__dirname, '/mock/array/add-to-array/single-line/expect.js'));
//
//                 assert.equal(expect.code, refactor.updateSourceCode(source.code, refactor.addToArray(source.ast, 'arr', 5)));
//             });
//             it('should return a string contains new item (multiple line)', () => {
//                 const source = _getAstAndCode(path.join(__dirname, '/mock/array/add-to-array/multiple-line/source.js'));
//                 const expect = _getAstAndCode(path.join(__dirname, '/mock/array/add-to-array/multiple-line/expect.js'));
//
//                 assert.equal(expect.code, refactor.updateSourceCode(source.code, refactor.addToArray(source.ast, 'arr', 'someAddition')));
//             });
//         });
//
//         // describe('Array.js#removeFromArray', () => {
//         //     it('should return a string not contains spec item', () => {
//         //         const source = _getAstAndCode(path.join(__dirname, '/mock/array/remove-from-array/single-line/source.js'));
//         //         const expect = _getAstAndCode(path.join(__dirname, '/mock/array/remove-from-array/single-line/expect.js'));
//         //
//         //         assert.equal(expect.code, refactor.updateSourceCode(source.code, refactor.removeFromArray(source.ast, 'arr', 5)));
//         //     });
//         //
//         //     it('should return a string not contains spec item (multiple line)', () => {
//         //         const source = _getAstAndCode(path.join(__dirname, '/mock/array/remove-from-array/multiple-line/source.js'));
//         //         const expect = _getAstAndCode(path.join(__dirname, '/mock/array/remove-from-array/multiple-line/expect.js'));
//         //
//         //         assert.equal(expect.code, refactor.updateSourceCode(source.code, refactor.removeFromArray(source.ast, 'arr', 'someAddition')));
//         //     });
//         // });
//     });
// });

/* eslint-disable */
const assert = require('assert');
const path = require('path');
const refactor = require('../../../../../../../cli/refactor');

exports.test = () => {
    describe('lines.js#lastLineIndex: multiple match', () => {
        it('should return number of line (real line - 1) in last export matching', () => {
            const lines = refactor.getLines(path.join(__dirname, 'source.js'));
            assert.equal(4, refactor.lastLineIndex(lines, /^let/));
        });

        it('should return number of line (real line - 1) in last export matching', () => {
            const lines = refactor.getLines(path.join(__dirname, 'source.js'));
            assert.equal(0, refactor.lastLineIndex(lines, /^const /));
        });

        it('should return -1 when not matching', () => {
            const lines = refactor.getLines(path.join(__dirname, 'source.js'));
            assert.equal(-1, refactor.lastLineIndex(lines, /^export default/));
        });
    });
};

/* eslint-disable */
const assert = require('assert');
const path = require('path');
const refactor = require('../../../../../../cli/refactor');

exports.test = () => {
    describe('lines.js#writeLine', () => {
        afterEach(() => {
            refactor.reset();
        });
        it('should write a code in file at a specific line (array)', () => {
            const lines = refactor.getLines(path.join(__dirname, 'source.js'));
            refactor.writeLine(lines, 1, ["const def = 'def';"]);

            const expectLines = refactor.getLines(path.join(__dirname, 'expect_1.js'));
            assert.deepEqual(expectLines, lines);
        });

        it('should write a code in file at a specific line (string)', () => {
            const lines = refactor.getLines(path.join(__dirname, 'source.js'));
            refactor.writeLine(lines, 1, "const def = 'def';\nconst ggg = 'ggg';");

            const expectLines = refactor.getLines(path.join(__dirname, 'expect_2.js'));
            assert.deepEqual(expectLines, lines);
        });

        it('should write a code in file at a specific line (array)', () => {
            const lines = refactor.getLines(path.join(__dirname, 'source.js'));
            refactor.writeLine(lines, 1, ["const def = 'def';", "const ggg = 'ggg';"]);

            const expectLines = refactor.getLines(path.join(__dirname, 'expect_2.js'));
            assert.deepEqual(expectLines, lines);
        });
    });
};

/* eslint-disable */
const assert = require('assert');
const path = require('path');
const refactor = require('../../../../../../cli/refactor');

exports.test = () => {
    describe('lines.js#isStringMatch', () => {
        it('should return true when a string contains in needle', () => {
            assert.ok(refactor.isStringMatch('abc', 'a'));
        });
        it('should return true when a string not contains in needle', () => {
            assert.equal(false, refactor.isStringMatch('abc', 'd'));
        });

        it('should return true when a string match in regex needle', () => {
            assert.ok(refactor.isStringMatch('export default tester', /^export/));
        });
        it('should return true when a string not match in regex needle', () => {
            assert.equal(false, refactor.isStringMatch('export default tester', /export$/));
        });
    })
};

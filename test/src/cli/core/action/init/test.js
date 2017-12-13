/* eslint-disable */
const assert = require('assert');
const refactor = require('../../../../../../cli/refactor');
const action = require('../../../../../../cli/core/action');

exports.test = () => {
    describe('action.js#init', () => {
        afterEach(function() {
            refactor.reset();
        });

        it('should have a action.js in redux folder', () => {
            const feature = 'newFeature';
            action.init(feature);

            assert.ok(!!refactor.toSave[refactor.getReduxFolder(feature) + '/' + action.FILENAME]);
        });
    })
};

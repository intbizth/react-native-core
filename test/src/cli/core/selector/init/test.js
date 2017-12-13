/* eslint-disable */
const assert = require('assert');
const refactor = require('../../../../../../cli/refactor');
const selector = require('../../../../../../cli/core/selector');

exports.test = () => {
    describe('selector.js#init', () => {
        afterEach(function() {
            refactor.reset();
        });

        it('should have a selectors.js in redux folder', () => {
            const feature = 'newFeature';
            selector.init(feature);

            assert.ok(!!refactor.toSave[refactor.getReduxFolder(feature) + '/' + selector.FILENAME]);
        });
    })
};

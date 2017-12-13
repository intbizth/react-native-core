/* eslint-disable */
const assert = require('assert');
const refactor = require('../../../../../../cli/refactor');
const constant = require('../../../../../../cli/core/constant');

exports.test = () => {
    describe('constant.js#init', () => {
        afterEach(function() {
            refactor.reset();
        });

        it('should have a constant.js in redux folder', () => {
            const feature = 'newFeature';
            constant.init(feature);

            assert.ok(!!refactor.toSave[refactor.getReduxFolder(feature) + '/' + constant.FILENAME]);
        });
    })
};

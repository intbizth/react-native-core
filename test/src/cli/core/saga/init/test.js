/* eslint-disable */
const assert = require('assert');
const refactor = require('../../../../../../cli/refactor');
const saga = require('../../../../../../cli/core/saga');

exports.test = () => {
    describe('saga.js#init', () => {
        afterEach(function() {
            refactor.reset();
        });

        it('should have a sagas.js in redux folder', () => {
            const feature = 'newFeature';
            saga.init(feature);

            assert.ok(!!refactor.toSave[refactor.getReduxFolder(feature) + '/' + saga.FILENAME]);
        });
    })
};

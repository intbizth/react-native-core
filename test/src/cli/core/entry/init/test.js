/* eslint-disable */
const assert = require('assert');
const _ = require('lodash');
const refactor = require('../../../../../../cli/refactor');
const entry = require('../../../../../../cli/core/entry');

exports.test = () => {
    describe('entry.js#initFolder', () => {
        afterEach(function() {
            refactor.reset();
        });

        it("should have a ['api','components','containers','forms','redux','screen'] in feature folder", () => {
            const feature = 'newFeature';
            const folders = ['api','components','containers','forms','redux','screen'];
            entry.initFolder(feature);

            _.each(folders, (f) => {
                assert.ok(refactor.dirs[refactor.getFeatureFolder(feature) + '/' + f]);
                assert.ok(!!refactor.toSave[refactor.getFeatureFolder(feature) + '/' + f + '/.gitkeep']);
            });
        });
    })
};

'use strict';

var fs = require('fs');
var _ = require('lodash');
var refactor = require('../refactor');
var entry = require('../core/entry');
var action = require('../core/action');
var router = require('../core/router');
var constant = require('../core/constant');
var initialState = require('../core/initialState');
var reducer = require('../core/reducer');
var saga = require('../core/saga');
var selector = require('../core/selector');

var _require = require('../core/feature'),
    makeFeatureFolderName = _require.makeFeatureFolderName;

function add(_ref) {
    var feature = _ref.feature;

    var featureName = makeFeatureFolderName(feature);
    var featureFolder = refactor.getFeatureFolder(featureName);

    if (fs.existsSync(featureFolder)) {
        refactor.error('Feature name "' + feature + '" exists in your project.');
    }

    refactor.mkdir(featureFolder);

    entry.initFolder(feature);
    action.init(feature);
    constant.init(feature);
    initialState.init(feature);
    reducer.init(feature);
    router.init(feature);
    saga.init(feature);
    selector.init(feature);

    entry.linkFeature(feature);

    refactor.flush();
}

function remove(_ref2) {
    var feature = _ref2.feature;

    var featureName = makeFeatureFolderName(feature);
    var featureFolder = refactor.getFeatureFolder(featureName);

    if (!fs.existsSync(featureFolder)) {
        refactor.error('Feature name "' + feature + '" do not exists in your project.');
    }

    entry.unlinkFeature(feature);

    refactor.del(featureFolder);

    refactor.flush();
}

module.exports = {
    add: add,
    remove: remove
};
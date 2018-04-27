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
        refactor.error('Feature name "' + featureName + '" exists in your project.');
    }

    refactor.mkdir(featureFolder);

    entry.initFolder(featureName);
    action.init(featureName);
    constant.init(featureName);
    initialState.init(featureName);
    reducer.init(featureName);
    router.init(featureName);
    saga.init(featureName);
    selector.init(featureName);

    entry.linkFeature(featureName);
}

function remove(_ref2) {
    var feature = _ref2.feature;

    var featureName = makeFeatureFolderName(feature);
    var featureFolder = refactor.getFeatureFolder(featureName);

    if (!fs.existsSync(featureFolder)) {
        refactor.error('Feature name "' + featureName + '" do not exists in your project.');
    }

    entry.unlinkFeature(featureName);

    refactor.del(featureFolder);
}

module.exports = {
    add: add,
    remove: remove,
    flush: function flush() {
        refactor.flush();
    }
};
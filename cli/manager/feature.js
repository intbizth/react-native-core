const fs = require('fs');
const _ = require('lodash');
const refactor = require('../refactor');
const entry = require('../core/entry');
const action = require('../core/action');
const router = require('../core/router');
const constant = require('../core/constant');
const initialState = require('../core/initialState');
const reducer = require('../core/reducer');
const saga = require('../core/saga');
const selector = require('../core/selector');


function add({feature}) {
    const featureName = makeFeatureFolderName(feature);
    const featureFolder = refactor.getFeatureFolder(featureName);

    if (fs.existsSync(featureFolder)) {
        refactor.error(`Feature name "${feature}" exists in your project.`);
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

function makeFeatureFolderName(name) {
    return _.kebabCase(name);
}

function remove({feature}) {
    const featureName = makeFeatureFolderName(feature);
    const featureFolder = refactor.getFeatureFolder(featureName);

    if (!fs.existsSync(featureFolder)) {
        refactor.error(`Feature name "${feature}" do not exists in your project.`);
    }

    entry.unlinkFeature(feature);

    refactor.del(featureFolder);

    refactor.flush();
}

module.exports = {
    add,
    makeFeatureFolderName,
    remove
};

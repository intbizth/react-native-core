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
const { makeFeatureFolderName } = require('../core/feature');


function add({feature}) {
    const featureName = makeFeatureFolderName(feature);
    const featureFolder = refactor.getFeatureFolder(featureName);

    if (fs.existsSync(featureFolder)) {
        refactor.error(`Feature name "${featureName}" exists in your project.`);
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

function remove({feature}) {
    const featureName = makeFeatureFolderName(feature);
    const featureFolder = refactor.getFeatureFolder(featureName);

    if (!fs.existsSync(featureFolder)) {
        refactor.error(`Feature name "${featureName}" do not exists in your project.`);
    }

    entry.unlinkFeature(featureName);

    refactor.del(featureFolder);
}

module.exports = {
    add,
    remove,
    flush: () => {
        refactor.flush();
    }
};

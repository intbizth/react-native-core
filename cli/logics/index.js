const fs = require('fs');
const _ = require('lodash');
const refactor = require('../refactor');
const constant = require('./constant');
const action = require('./action');
const initialState = require('./initialState');
const saga = require('./saga');
const entry = require('./entry');
const reducer = require('./reducer');

function make(feature, name, options) {
    const featureFolder = refactor.getFeatureFolder(feature);

    if (!fs.existsSync(featureFolder)) {
        refactor.error(`Feature name "${feature}" not exists in your project.`);
    }

    refactor.info(
        ` 
=====================================
=           Generating              =
=====================================
`
    );
    const constantName = constant.add(feature, name, options);
    initialState.add(feature, name, options, constantName);
    const actionName = action.add(feature, name, options, constantName);
    const sagaName = saga.add(feature, name, options, actionName, constantName);
    const reducerName = reducer.add(feature, name, options, constantName);

    refactor.info(
        ` 
=====================================
=              Linking              =
=====================================
`
    );

    if (sagaName) {
        entry.linkSaga(feature, name, options, sagaName);
    }

    if (reducerName) {
        entry.linkSaga(feature, name, options, sagaName);
    }

    //refactor.flush();

    refactor.info('Complete.. ;))');
}

module.exports = { make };

const fs = require('fs');
const _ = require('lodash');
const refactor = require('../refactor');
const constant = require('./constant');
const action = require('./action');
const initialState = require('./initialState');
const saga = require('./saga');
const entry = require('./entry');
const reducer = require('./reducer');

function make(answers) {
    const { feature, withSaga, withReducer } = answers;
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
    constant.add(answers);
    initialState.add(answers);
    action.add(answers);

    if (withSaga) {
        saga.add(answers);
        if (withReducer) {
            reducer.add(answers);
        }
    }


    refactor.info(
        ` 
=====================================
=              Linking              =
=====================================
`
    );

    if (withSaga) {
        entry.linkSaga(answers);
        if (withReducer) {
            entry.linkReducer(answers);
        }
    }

    //refactor.flush();

    refactor.info('Complete.. ;))');
}

module.exports = { make };

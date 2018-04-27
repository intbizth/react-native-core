'use strict';

var fs = require('fs');
var refactor = require('../refactor');
var constant = require('../core/constant');
var action = require('../core/action');
var initialState = require('../core/initialState');
var saga = require('../core/saga');
var entry = require('../core/entry');
var reducer = require('../core/reducer');

function make(answers) {
    var feature = answers.feature,
        withSaga = answers.withSaga,
        withReducer = answers.withReducer;

    var featureFolder = refactor.getFeatureFolder(feature);

    if (!fs.existsSync(featureFolder)) {
        refactor.error('Feature name "' + feature + '" not exists in your project.');
    }

    refactor.info(' \n=====================================\n=           Generating              =\n=====================================\n');
    constant.add(answers);
    initialState.add(answers);
    action.add(answers);

    if (withSaga) {
        saga.add(answers);
        if (withReducer) {
            reducer.add(answers);
        }
    }

    refactor.info(' \n=====================================\n=              Linking              =\n=====================================\n');

    if (withSaga) {
        entry.linkSaga(answers);
        if (withReducer) {
            entry.linkReducer(answers);
        }
    }

    refactor.info('Complete.. ;))');
}

function remove(answers) {
    var feature = answers.feature,
        withSaga = answers.withSaga;

    var featureFolder = refactor.getFeatureFolder(feature);

    if (!fs.existsSync(featureFolder)) {
        refactor.error('Feature name "' + feature + '" not exists in your project.');
    }

    refactor.info(' \n=====================================\n=             Removing              =\n=====================================\n');
    answers.type = constant.remove(answers); // will return guessing type...
    initialState.remove(answers);
    action.remove(answers);

    if (withSaga) {
        saga.remove(answers);
        reducer.remove(answers);

        saga.removeEmptyFile(answers);
    }

    refactor.info(' \n=====================================\n=             Unlinking             =\n=====================================\n');

    if (withSaga) {
        entry.unlinkSaga(answers);
        entry.unlinkReducer(answers);
    }

    refactor.info('Complete.. ;))');
}

module.exports = { make: make, remove: remove, flush: function flush() {
        return refactor.flush();
    } };
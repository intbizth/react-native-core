'use strict';

var fs = require('fs');
var _ = require('lodash');
var refactor = require('../refactor');
var constant = require('./constant');
var action = require('./action');
var initialState = require('./initialState');
var saga = require('./saga');
var entry = require('./entry');
var reducer = require('./reducer');

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

    refactor.flush();

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

    refactor.flush();

    refactor.info('Complete.. ;))');
}

module.exports = { make: make, remove: remove };
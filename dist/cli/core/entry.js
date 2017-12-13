'use strict';

var _ = require('lodash');
var refactor = require('../refactor');
var saga = require('./saga');
var reducer = require('./reducer');

var _require = require('./feature'),
    makeFeatureFolderName = _require.makeFeatureFolderName;

function linkSaga(_ref) {
    var feature = _ref.feature,
        name = _ref.name,
        type = _ref.type,
        withSaga = _ref.withSaga;

    var targetPath = refactor.getReduxFolder(feature) + '/' + saga.FILENAME;
    var sagaName = saga.makeSagaName(name, type);

    refactor.updateFile(targetPath, function (ast) {
        return [].concat(refactor.addExportFrom(ast, './reducers/' + _.snakeCase(withSaga), '', [sagaName]));
    });

    refactor.success('Saga: "' + sagaName + '" linked in "' + targetPath + '"');
}

function unlinkSaga(_ref2) {
    var feature = _ref2.feature,
        name = _ref2.name,
        type = _ref2.type;

    var targetPath = refactor.getReduxFolder(feature) + '/' + saga.FILENAME;
    var sagaName = saga.makeSagaName(name, type);

    refactor.updateFile(targetPath, function (ast) {
        return [].concat(refactor.removeExportSpecifier(ast, sagaName));
    });

    refactor.success('Saga: "' + sagaName + '" unlinked in "' + targetPath + '"');
}

function linkReducer(_ref3) {
    var feature = _ref3.feature,
        name = _ref3.name,
        withSaga = _ref3.withSaga;

    var targetPath = refactor.getReduxFolder(feature) + '/' + reducer.FILENAME;
    var reducerName = reducer.makeReducerName(name);

    refactor.updateFile(targetPath, function (ast) {
        return [].concat(refactor.addImportFrom(ast, './reducers/' + _.snakeCase(withSaga), '', [reducerName]), refactor.addToArray(ast, 'reducers', reducerName));
    });

    refactor.success('Reducer: "' + reducerName + '" linked in "' + targetPath + '"');
}

function unlinkReducer(_ref4) {
    var feature = _ref4.feature,
        name = _ref4.name;

    var targetPath = refactor.getReduxFolder(feature) + '/' + reducer.FILENAME;
    var reducerName = reducer.makeReducerName(name);

    refactor.updateFile(targetPath, function (ast) {
        return [].concat(refactor.removeImportSpecifier(ast, reducerName), refactor.removeFromArray(ast, 'reducers', reducerName));
    });

    refactor.success('Reducer: "' + reducerName + '" unlinked in "' + targetPath + '"');
}

function linkFeature(feature) {
    var commonFolder = refactor.getCommonFolder();

    if (!refactor.dirExists(commonFolder)) {
        refactor.info(commonFolder + ' do not exists in your project, In order to link "' + feature + '" to root you have to create rootReducer.js and rootSaga.js under "common" folder and manual link!!');
        return;
    }

    var reducerEntryName = feature + 'Reducer';
    refactor.updateFile(commonFolder + '/rootReducer.js', function (ast) {
        return [].concat(refactor.addImportFrom(ast, '../features/' + makeFeatureFolderName(feature) + '/redux/reducer', reducerEntryName), refactor.addObjectProperty(ast, 'featureReducers', _.camelCase(feature), reducerEntryName));
    });

    var sagaEntryName = feature + 'Sagas';
    refactor.updateFile(commonFolder + '/rootSaga.js', function (ast) {
        return [].concat(refactor.addImportFrom(ast, '../features/' + makeFeatureFolderName(feature) + '/redux/sagas', '* as ' + sagaEntryName), refactor.addToArray(ast, 'featureSagas', sagaEntryName));
    });

    refactor.success('Feature: "' + feature + '" linked');
}

function unlinkFeature(feature) {
    var commonFolder = refactor.getCommonFolder();

    if (!refactor.dirExists(commonFolder)) {
        return;
    }

    var reducerEntryName = feature + 'Reducer';
    refactor.updateFile(commonFolder + '/rootReducer.js', function (ast) {
        return [].concat(refactor.removeImportSpecifier(ast, reducerEntryName), refactor.removeObjectProperty(ast, 'featureReducers', _.camelCase(feature)));
    });

    var sagaEntryName = feature + 'Sagas';
    refactor.updateFile(commonFolder + '/rootSaga.js', function (ast) {
        return [].concat(refactor.removeImportSpecifier(ast, sagaEntryName), refactor.removeFromArray(ast, 'featureSagas', sagaEntryName));
    });

    refactor.success('Feature: "' + feature + '" unlinked');
}

function initFolder(feature) {
    var featureFolder = refactor.getFeatureFolder(feature);
    _.each(['api', 'components', 'containers', 'forms', 'redux', 'screen'], function (f) {
        var folder = featureFolder + '/' + f;
        refactor.mkdir(folder);
        refactor.save(folder + '/.gitkeep', [""]);
    });
}

module.exports = {
    initFolder: initFolder,
    linkFeature: linkFeature,
    unlinkFeature: unlinkFeature,
    linkSaga: linkSaga,
    unlinkSaga: unlinkSaga,
    linkReducer: linkReducer,
    unlinkReducer: unlinkReducer
};
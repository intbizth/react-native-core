const _ = require('lodash');
const refactor = require('../refactor');
const saga = require('./saga');
const reducer = require('./reducer');
const { makeFeatureFolderName } = require('./feature');

function linkSaga({feature, name, type, withSaga}) {
    const targetPath = refactor.getReduxFolder(feature) + '/' + saga.FILENAME;
    const sagaName = saga.makeSagaName(name, type);

    refactor.updateFile(targetPath, ast => [].concat(
        refactor.addExportFrom(ast, `./reducers/${_.snakeCase(withSaga)}`, '', [sagaName])
    ));

    refactor.success(`Saga: "${sagaName}" linked in "${targetPath}"`);
}

function unlinkSaga({feature, name, type}) {
    const targetPath = refactor.getReduxFolder(feature) + '/' + saga.FILENAME;
    const sagaName = saga.makeSagaName(name, type);

    refactor.updateFile(targetPath, ast => [].concat(
        refactor.removeExportSpecifier(ast, sagaName)
    ));

    refactor.success(`Saga: "${sagaName}" unlinked in "${targetPath}"`);
}

function linkReducer({feature, name, withSaga}) {
    const targetPath = refactor.getReduxFolder(feature) + '/' + reducer.FILENAME;
    const reducerName = reducer.makeReducerName(name);

    refactor.updateFile(targetPath, ast => [].concat(
        refactor.addImportFrom(ast, `./reducers/${_.snakeCase(withSaga)}`, '', [reducerName]),
        refactor.addToArray(ast, 'reducers', reducerName)
    ));

    refactor.success(`Reducer: "${reducerName}" linked in "${targetPath}"`);
}

function unlinkReducer({feature, name}) {
    const targetPath = refactor.getReduxFolder(feature) + '/' + reducer.FILENAME;
    const reducerName = reducer.makeReducerName(name);

    refactor.updateFile(targetPath, ast => [].concat(
        refactor.removeImportSpecifier(ast, reducerName),
        refactor.removeFromArray(ast, 'reducers', reducerName)
    ));

    refactor.success(`Reducer: "${reducerName}" unlinked in "${targetPath}"`);
}

function linkFeature(feature) {
    const commonFolder = refactor.getCommonFolder();

    if (!refactor.dirExists(commonFolder)) {
        refactor.info(`${commonFolder} do not exists in your project, In order to link "${feature}" to root you have to create rootReducer.js and rootSaga.js under "common" folder and manual link!!`)
        return;
    }

    const reducerEntryName = `${feature}Reducer`;
    refactor.updateFile(commonFolder + '/rootReducer.js', ast => [].concat(
        refactor.addImportFrom(ast, `../features/${makeFeatureFolderName(feature)}/redux/reducer`, reducerEntryName),
        refactor.addObjectProperty(ast, 'featureReducers', _.camelCase(feature), reducerEntryName),
    ));

    const sagaEntryName = `${feature}Sagas`;
    refactor.updateFile(commonFolder + '/rootSaga.js', ast => [].concat(
        refactor.addImportFrom(ast, `../features/${makeFeatureFolderName(feature)}/redux/sagas`, `* as ${sagaEntryName}`),
        refactor.addToArray(ast, 'featureSagas', sagaEntryName),
    ));

    refactor.success(`Feature: "${feature}" linked`);
}

function unlinkFeature(feature) {
    const commonFolder = refactor.getCommonFolder();

    if (!refactor.dirExists(commonFolder)) {
        return;
    }

    const reducerEntryName = `${feature}Reducer`;
    refactor.updateFile(commonFolder + '/rootReducer.js', ast => [].concat(
        refactor.removeImportSpecifier(ast, reducerEntryName),
        refactor.removeObjectProperty(ast, 'featureReducers', _.camelCase(feature)),
    ));

    const sagaEntryName = `${feature}Sagas`;
    refactor.updateFile(commonFolder + '/rootSaga.js', ast => [].concat(
        refactor.removeImportSpecifier(ast, sagaEntryName),
        refactor.removeFromArray(ast, 'featureSagas', sagaEntryName),
    ));

    refactor.success(`Feature: "${feature}" unlinked`);
}


function initFolder(feature) {
    const featureFolder = refactor.getFeatureFolder(feature);
    _.each(['api',
        'components',
        'containers',
        'forms',
        'redux',
        'screen'], (f) => {
        const folder = featureFolder + '/' + f;
        refactor.mkdir(folder);
        refactor.save(folder + '/.gitkeep', [""]);
    });
}

module.exports = {
    initFolder,
    linkFeature,
    unlinkFeature,
    linkSaga,
    unlinkSaga,
    linkReducer,
    unlinkReducer,
};

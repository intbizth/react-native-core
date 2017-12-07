const _ = require('lodash');
const refactor = require('../refactor');
const makeSagaName = require('./saga').makeSagaName;
const makeReducerName = require('./reducer').makeReducerName;

function linkSaga({feature, name, type, withSaga}) {
    const targetPath = refactor.getReduxFolder(feature) + '/sagas.js';
    const sagaName = makeSagaName(name, type);

    refactor.updateFile(targetPath, ast => [].concat(
        refactor.addExportFrom(ast, `./reducers/${_.snakeCase(withSaga)}`, '', [sagaName])
    ));

    refactor.success(`Saga: "${sagaName}" linked in "${targetPath}"`);
}

function unlinkSaga({feature, name, type}) {
    const targetPath = refactor.getReduxFolder(feature) + '/sagas.js';
    const sagaName = makeSagaName(name, type);

    refactor.updateFile(targetPath, ast => [].concat(
        refactor.removeExportSpecifier(ast, sagaName)
    ));

    refactor.success(`Saga: "${sagaName}" unlinked in "${targetPath}"`);
}

function linkReducer({feature, name, withSaga}) {
    const targetPath = refactor.getReduxFolder(feature) + '/reducer.js';
    const reducerName = makeReducerName(name);

    refactor.updateFile(targetPath, ast => [].concat(
        refactor.addImportFrom(ast, `./reducers/${_.snakeCase(withSaga)}`, '', [reducerName]),
        refactor.addToArray(ast, 'reducers', reducerName)
    ));

    refactor.success(`Reducer: "${reducerName}" linked in "${targetPath}"`);
}

function unlinkReducer({feature, name}) {
    const targetPath = refactor.getReduxFolder(feature) + '/reducer.js';
    const reducerName = makeReducerName(name);

    refactor.updateFile(targetPath, ast => [].concat(
        refactor.removeImportSpecifier(ast, reducerName),
        refactor.removeFromArray(ast, 'reducers', reducerName)
    ));

    refactor.success(`Reducer: "${reducerName}" unlinked in "${targetPath}"`);
}

module.exports = {
    linkSaga,
    unlinkSaga,
    linkReducer,
    unlinkReducer,
};

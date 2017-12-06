const _ = require('lodash');
const refactor = require('../refactor');

function linkSaga(feature, name, options, sagaName) {
    const targetPath = refactor.getReduxFolder(feature) + '/sagas.js';

    refactor.updateFile(targetPath, ast => [].concat(
        refactor.addExportFrom(ast, `./reducers/${_.snakeCase(options.withSaga)}`, '', [sagaName])
    ));

    refactor.success(`Saga: "${sagaName}" linked in "${targetPath}"`);
}

function linkReducer(feature, name, options, reducerName) {
    const targetPath = refactor.getReduxFolder(feature) + '/reducer.js';

    refactor.updateFile(targetPath, ast => [].concat(
        refactor.addImportFrom(ast, `./reducers/${_.snakeCase(options.withSaga)}`, '', [reducerName]),
        refactor.addToArray(ast, 'reducers', reducerName)
    ));

    refactor.success(`Reducer: "${reducerName}" linked in "${targetPath}"`);
}

module.exports = {
    linkSaga,
    linkReducer
};

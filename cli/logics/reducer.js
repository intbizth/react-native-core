const _ = require('lodash');
const refactor = require('../refactor');
const CONSTANTS = require('../constants');

function add(feature, name, options, constantName) {
    if (!options.withReducer || !options.withSaga) {
        return;
    }

    const reduxFolder = refactor.getReduxFolder(feature);
    const targetPath =  `${reduxFolder}/reducers/${_.snakeCase(options.withSaga)}.js`;
    const reducerName =  _.camelCase(name + 'Reducer');
    let lines = refactor.getLines(targetPath);

    if(refactor.isStringMatch(lines.join(" "), new RegExp(`(.+)export const ${reducerName}(.+)`))) {
        refactor.info(`Reducer: "${reducerName}" exists in "${targetPath}"`);
        return reducerName;
    }

    lines.splice(lines.length + 1, 0, `export const ${reducerName} = ${_getReducerName(options.type)}(${constantName}, ${constantName}_STATE_KEY);`);

    refactor.save(targetPath, lines);

    refactor.updateFile(targetPath, ast => [].concat(
        refactor.addImportFrom(ast, `${CONSTANTS.PACKAGE_NAME}/api/${options.type}/reducer`,  _getReducerName(options.type)),
        refactor.addImportFrom(ast, `../constants`, '', [`${constantName}_STATE_KEY`]),
    ));

    refactor.success(`Reducer: "${reducerName}" created in "${targetPath}"`);
    return reducerName;
}

function _getReducerName(actionType) {
    switch (actionType) {
        case 'request':
            return 'requestReducer';
        case 'submit':
            return 'submitReducer';
        case 'paginate':
            return 'indexReducer';
    }
}

module.exports = {
    add,
};

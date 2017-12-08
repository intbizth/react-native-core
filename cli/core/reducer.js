const _ = require('lodash');
const refactor = require('../refactor');
const makeConstantStateKeyName = require('./constant').makeConstantStateKeyName;
const makeConstantName = require('./constant').makeConstantName;
const CONSTANTS = require('../constants');


function add({feature, name, type, withSaga}) {
    const reduxFolder = refactor.getReduxFolder(feature);
    const targetPath =  `${reduxFolder}/reducers/${_.snakeCase(withSaga)}.js`;
    const reducerName =  makeReducerName(name);
    const constantName =  makeConstantName(name);
    const constantStateKeyName =  makeConstantStateKeyName(name);

    let lines = refactor.getLines(targetPath);

    if(refactor.isStringMatch(lines.join(" "), new RegExp(`(.+)export const ${reducerName}(.+)`))) {
        refactor.info(`Reducer: "${reducerName}" exists in "${targetPath}"`);
        return;
    }

    lines.splice(lines.length + 1, 0, `export const ${reducerName} = ${_getReducerName(type)}(${constantName}, ${constantStateKeyName});`);

    refactor.save(targetPath, lines);

    refactor.updateFile(targetPath, ast => [].concat(
        refactor.addImportFrom(ast, `${CONSTANTS.PACKAGE_NAME}/api/${type}/reducer`,  _getReducerName(type)),
        refactor.addImportFrom(ast, `../constants`, '', [constantName, constantStateKeyName]),
    ));

    refactor.success(`Reducer: "${reducerName}" created in "${targetPath}"`);
}

function remove({feature, name, type, withSaga}) {
    const reduxFolder = refactor.getReduxFolder(feature);
    const targetPath =  `${reduxFolder}/reducers/${_.snakeCase(withSaga)}.js`;
    if (!refactor.fileExists(targetPath)) {
        return;
    }

    const reducerName =  makeReducerName(name);
    const constantName =  makeConstantName(name);
    const constantStateKeyName =  makeConstantStateKeyName(name);

    let lines = refactor.getLines(targetPath);

    if(!refactor.isStringMatch(lines.join(" "), new RegExp(`(.+)export const ${reducerName}(.+)`))) {
        return;
    }

    refactor.removeLines(lines, new RegExp(`^export const ${reducerName}`));
    refactor.save(targetPath, lines);

    refactor.updateFile(targetPath, ast => [].concat(
        refactor.removeImportSpecifier(ast, _getReducerName(type)),
        refactor.removeImportSpecifier(ast, constantName),
        refactor.removeImportSpecifier(ast, constantStateKeyName),
    ));

    refactor.success(`Reducer: "${reducerName}" removed in "${targetPath}"`);
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

function makeReducerName(name) {
    return _.camelCase(name + 'Reducer');
}


module.exports = {
    add,
    remove,
    makeReducerName
};

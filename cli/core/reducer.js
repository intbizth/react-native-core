const _ = require('lodash');
const tmpl = require('blueimp-tmpl');
const refactor = require('../refactor');
const makeConstantStateKeyName = require('./constant').makeConstantStateKeyName;
const makeConstantName = require('./constant').makeConstantName;
const CONSTANTS = require('../constants');
const prototype = require('../prototype/reducer');

function add({feature, name, type, withSaga}) {
    const reduxFolder = refactor.getReduxFolder(feature);
    const targetPath =  `${reduxFolder}/reducers/${_.snakeCase(withSaga)}.js`;
    const reducerName =  makeReducerName(name);
    const reducer =  _getReducerName(type);
    const constantName =  makeConstantName(name);
    const constantStateKeyName =  makeConstantStateKeyName(name);

    const reducerTpl = tmpl(prototype, {
        reducerName,
        reducer,
        constantName,
        constantStateKeyName
    });

    let lines = refactor.getLines(targetPath);

    if(refactor.isStringMatch(lines.join(" "), reducerTpl)) {
        refactor.info(`Reducer: "${reducerName}" exists in "${targetPath}"`);
        return;
    }

    refactor.writeLine(lines, _.last(lines) + 1, reducerTpl);
    refactor.save(targetPath, lines);

    refactor.updateFile(targetPath, ast => [].concat(
        refactor.addImportFrom(ast, `${CONSTANTS.PACKAGE_NAME}/api/${type}/reducer`,  reducer),
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

    const reducer =  _getReducerName(type);
    const reducerName =  makeReducerName(name);
    const constantName =  makeConstantName(name);
    const constantStateKeyName =  makeConstantStateKeyName(name);
    const reducerTpl = tmpl(prototype, {
        reducerName,
        reducer,
        constantName,
        constantStateKeyName
    });

    let lines = refactor.getLines(targetPath);
    if(!refactor.isStringMatch(lines.join(" "), reducerTpl)) {
        return;
    }

    refactor.removeLines(lines, reducerTpl);
    refactor.save(targetPath, lines);

    refactor.updateFile(targetPath, ast => [].concat(
        refactor.removeImportSpecifier(ast, reducer),
        refactor.removeImportSpecifier(ast, [constantName, constantStateKeyName]),
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

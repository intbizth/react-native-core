const _ = require('lodash');
const refactor = require('../refactor');
const makeActionName = require('./action').makeActionName;
const makeConstantName = require('./constant').makeConstantName;
const makeConstantStateKeyName = require('./constant').makeConstantStateKeyName;
const CONSTANTS = require('../constants');

function add({feature, name, type, withSaga}) {
    const reduxFolder = refactor.getReduxFolder(feature);

    if (!refactor.dirExists(reduxFolder + '/reducers')) {
        refactor.mkdir(reduxFolder + '/reducers');
    }

    const targetPath =  `${reduxFolder}/reducers/${_.snakeCase(withSaga)}.js`;

    let lines = [];
    if (refactor.fileExists(targetPath)) {
        lines = refactor.getLines(targetPath);
    }

    const sagaName = makeSagaName(name, type);
    const constantName = makeConstantName(name);
    const constantStateKeyName = makeConstantStateKeyName(name);
    const actionName = makeActionName(name);

    if(refactor.isStringMatch(lines.join(" "), new RegExp(`(.+)export const ${sagaName}(.+)`))) {
        refactor.info(`Saga: "${sagaName}" exists in "${targetPath}"`);
        return;
    }


    let funcLines = [];
    let sagasImport = [];
    if ('paginate' === type) {
        sagasImport = ['take', 'select', 'fork'];
        funcLines = `
export const ${sagaName} = function*() {
    while (true) {
        const action = yield take([${constantName}.REQUEST, ${constantName}.LOADMORE, ${constantName}.REFRESH]);
        const data = yield select((state) => state.${_.snakeCase(feature)}[${constantStateKeyName}]);
        
        yield fork(${_getActionSaga(type)}, ${actionName}, {
            apiFunction: '__SOME_API__',
            args: [
                (action.type === ${constantName}.LOADMORE) ? data.pagination.currentPage + 1 : 1
            ]
        }, {showLoading: action.type === ${constantName}.REQUEST})
    }
};
`.split('\n');
    } else if ('submit' === type) {
        sagasImport = ['take', 'fork'];
        funcLines = `
export const ${sagaName} = function*() {
    while (true) {
        const submitAction = yield take(${constantName}.SUBMIT);

        yield fork(${_getActionSaga(type)}, ${actionName}, {
            apiFunction: '__SOME_API__',
            args: []
        });

        const action = yield take([
            ${constantName}.SUBMIT_VALIDATION_FAILED,
            ${constantName}.SUBMIT_SUCCESS,
            ${constantName}.SUBMIT_FAILURE,
        ]);

        if (action.type === ${constantName}.SUBMIT_SUCCESS) {
            // do stuff on success
        }
    }
};
`.split('\n');
    } else {
        sagasImport = ['call', 'takeLatest'];
        funcLines = `
export const ${sagaName} = function*() {
    yield takeLatest(${constantName}.${_getConst(type)}, function*() {
        // do staff
        yield call(${_getActionSaga(type)}, ${actionName}, {
            apiFunction: '__SOME_API__',
            args: []
        })
    });
};
`.split('\n');
    }


    let i = refactor.lastLineIndex(lines, /^export const reducer/);
    if (-1 === i) {
        i = lines.length + 1;
    }
    for (let j in funcLines) {
        lines.splice(i + 1 + j, 0,  funcLines[j]);
    }

    refactor.save(targetPath, lines);

    refactor.updateFile(targetPath, ast => [].concat(
        refactor.addImportFrom(ast, `redux-saga/effects`, '', sagasImport),
        refactor.addImportFrom(ast, `${CONSTANTS.PACKAGE_NAME}/api/${type}/saga`, '', [_getActionSaga(type)]),
        refactor.addImportFrom(ast, `../constants`, '', [constantName]),
        refactor.addImportFrom(ast, `../actions`, '', [actionName]),
    ));

    if ('paginate' === type) {
        refactor.updateFile(targetPath, ast => [].concat(
            refactor.addImportFrom(ast, `../constants`, '', [constantStateKeyName]),
        ));
    }

    refactor.success(`Saga: "${sagaName}" created in "${targetPath}"`);
}

function remove({feature, name, type, withSaga}) {
    const reduxFolder = refactor.getReduxFolder(feature);

    const targetPath =  `${reduxFolder}/reducers/${_.snakeCase(withSaga)}.js`;
    if (!refactor.fileExists(targetPath)) {
        return;
    }

    const sagaName = makeSagaName(name, type);
    const constantName = makeConstantName(name);
    const constantStateKeyName = makeConstantStateKeyName(name);
    const actionName = makeActionName(name);

    refactor.updateFile(targetPath, ast => [].concat(
        refactor.removeExportSpecifier(ast, sagaName),
        refactor.removeImportSpecifier(ast, _getActionSaga(type)),
        refactor.removeImportSpecifier(ast, constantName),
        refactor.removeImportSpecifier(ast, constantStateKeyName),
        refactor.removeImportSpecifier(ast, actionName),
    ));

    refactor.success(`Saga: "${sagaName}" removed in "${targetPath}"`);
}

function removeEmptyFile({feature, withSaga}) {
    const reduxFolder = refactor.getReduxFolder(feature);
    const targetPath =  `${reduxFolder}/reducers/${_.snakeCase(withSaga)}.js`;
    if (!refactor.fileExists(targetPath)) {
        return;
    }

    if (!refactor.removeFileWhichNoExported(targetPath)) {
        return;
    }

    refactor.success(`Filename: "${targetPath}" removed`);
}

function _getActionSaga(actionType) {
    switch (actionType) {
        case 'request':
            return 'doRequest';
        case 'submit':
            return 'doSubmit';
        case 'paginate':
            return 'doRequest';
    }
}

function _getConst(actionType) {
    switch (actionType) {
        case 'request':
            return 'REQUEST';
        case 'submit':
            return 'SUBMIT';
    }
}

function makeSagaName(name, actionType) {
    return _.camelCase('watch_' + name + '_' + actionType);
}

module.exports = {
    add,
    remove,
    removeEmptyFile,
    makeSagaName
};

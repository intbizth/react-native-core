const _ = require('lodash');
const refactor = require('../refactor');
const CONSTANTS = require('../constants');

function add(feature, name, options, actionName, constantName) {
    if (!options.withSaga) {
        return;
    }
    const reduxFolder = refactor.getReduxFolder(feature);

    if (!refactor.dirExists(reduxFolder + '/reducers')) {
        refactor.mkdir(reduxFolder + '/reducers');
    }

    const targetPath =  `${reduxFolder}/reducers/${_.snakeCase(options.withSaga)}.js`;

    let lines = [];
    if (refactor.fileExists(targetPath)) {
        lines = refactor.getLines(targetPath);
    }

    const sagaName = _.camelCase('watch_' + name + '_' + options.type);

    if(refactor.isStringMatch(lines.join(" "), new RegExp(`(.+)export const ${sagaName}(.+)`))) {
        refactor.info(`Saga: "${sagaName}" exists in "${targetPath}"`);
        return sagaName;
    }


    let funcLines = [];
    let sagasImport = [];
    if ('paginate' === options.type) {
        sagasImport = ['take', 'select', 'fork'];
        funcLines = `
export const ${sagaName} = function*() {
    while (true) {
        const action = yield take([${constantName}.REQUEST, ${constantName}.LOADMORE, ${constantName}.REFRESH]);
        const data = yield select((state) => state.${_.snakeCase(feature)}[${constantName}_STATE_KEY]);
        
        yield fork(${_getActionSaga(options.type)}, ${actionName}, {
            apiFunction: '__SOME_API__',
            args: [
                (action.type === ${constantName}.LOADMORE) ? data.pagination.currentPage + 1 : 1
            ]
        }, {showLoading: action.type === ${constantName}.REQUEST})
    }
};
`.split('\n');
    } else {
        sagasImport = ['call', 'takeLatest'];
        funcLines = `
export const ${sagaName} = function*() {
    yield takeLatest(${constantName}.${_getConst(options.type)}, function*() {
        // do staff
        yield call(${_getActionSaga(options.type)}, ${actionName}, {
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
        refactor.addImportFrom(ast, `${CONSTANTS.PACKAGE_NAME}/api/${options.type}/action`, '', [_getActionSaga(options.type)]),
        refactor.addImportFrom(ast, `../constants`, '', [constantName]),
        refactor.addImportFrom(ast, `../actions`, '', [actionName]),
    ));

    refactor.success(`Saga: "${sagaName}" created in "${targetPath}"`);
    return sagaName;
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

module.exports = {
    add,
};

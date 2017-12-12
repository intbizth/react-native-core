'use strict';

// note: if u wanna change, Please aware add `sagaImport` see: core/saga.js

module.exports = {
    paginate: {
        sagaImports: ['take', 'select', 'fork'],
        code: '\nexport const {%=o.sagaName%} = function*() {\n    while (true) {\n        const action = yield take([{%=o.constantName%}.REQUEST, {%=o.constantName%}.LOADMORE, {%=o.constantName%}.REFRESH]);\n        const data = yield select((state) => state.{%=o.featureReducerKey%}[{%=o.constantStateKeyName%}]);\n\n        yield fork({%=o.actionSaga%}, {%=o.actionName%}, {\n            apiFunction: \'__SOME_API__\',\n            args: [\n                (action.type === {%=o.constantName%}.LOADMORE) ? data.pagination.currentPage + 1 : 1\n            ]\n        }, {showLoading: action.type === {%=o.constantName%}.REQUEST})\n    }\n};\n'
    },

    submit: {
        sagaImports: ['take', 'fork'],
        code: '\nexport const {%=o.sagaName%} = function*() {\n    while (true) {\n        const submitAction = yield take({%=o.constantName%}.SUBMIT);\n\n        yield fork({%=o.actionSaga%}, {%=o.actionName%}, {\n            apiFunction: \'__SOME_API__\',\n            args: []\n        });\n\n        const action = yield take([\n            {%=o.constantName%}.SUBMIT_VALIDATION_FAILED,\n            {%=o.constantName%}.SUBMIT_SUCCESS,\n            {%=o.constantName%}.SUBMIT_FAILURE,\n        ]);\n\n        if (action.type === {%=o.constantName%}.SUBMIT_SUCCESS) {\n            // do stuff on success\n        }\n    }\n};\n'
    },

    request: {
        sagaImports: ['call', 'takeLatest'],
        code: '\nexport const {%=o.sagaName%} = function*() {\n    yield takeLatest({%=o.constantName%}.REQUEST, function*() {\n        // do staff\n        yield call({%=o.actionSaga%}, {%=o.actionName%}, {\n            apiFunction: \'__SOME_API__\',\n            args: []\n        })\n    });\n};\n'
    }
};
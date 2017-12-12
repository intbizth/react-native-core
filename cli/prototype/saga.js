// note: if u wanna change, Please aware add `sagaImport` see: core/saga.js

module.exports = {
    paginate: {
        sagaImports: ['take', 'select', 'fork'],
        code:
`
export const {%=o.sagaName%} = function*() {
    while (true) {
        const action = yield take([{%=o.constantName%}.REQUEST, {%=o.constantName%}.LOADMORE, {%=o.constantName%}.REFRESH]);
        const data = yield select((state) => state.{%=o.featureReducerKey%}[{%=o.constantStateKeyName%}]);

        yield fork({%=o.actionSaga%}, {%=o.actionName%}, {
            apiFunction: '__SOME_API__',
            args: [
                (action.type === {%=o.constantName%}.LOADMORE) ? data.pagination.currentPage + 1 : 1
            ]
        }, {showLoading: action.type === {%=o.constantName%}.REQUEST})
    }
};
`
    }
,
    submit: {
        sagaImports: ['take', 'fork'],
        code:
`
export const {%=o.sagaName%} = function*() {
    while (true) {
        const submitAction = yield take({%=o.constantName%}.SUBMIT);

        yield fork({%=o.actionSaga%}, {%=o.actionName%}, {
            apiFunction: '__SOME_API__',
            args: []
        });

        const action = yield take([
            {%=o.constantName%}.SUBMIT_VALIDATION_FAILED,
            {%=o.constantName%}.SUBMIT_SUCCESS,
            {%=o.constantName%}.SUBMIT_FAILURE,
        ]);

        if (action.type === {%=o.constantName%}.SUBMIT_SUCCESS) {
            // do stuff on success
        }
    }
};
`
    }
,
    request: {
        sagaImports: ['call', 'takeLatest'],
        code:
`
export const {%=o.sagaName%} = function*() {
    yield takeLatest({%=o.constantName%}.REQUEST, function*() {
        // do staff
        yield call({%=o.actionSaga%}, {%=o.actionName%}, {
            apiFunction: '__SOME_API__',
            args: []
        })
    });
};
`
    }
};

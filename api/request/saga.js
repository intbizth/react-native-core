import extend from 'lodash/extend';
import {call, put, take, fork} from 'redux-saga/effects';
import { showLoadingOverlayAndDisableBack, showLoadingOverlay, hideLoadingOverlay } from '../../redux/actions';

export const doRequest = function*(entityActions, apiFn, userOptions = {}) {
    const options = extend({
        showLoading: true,
        hideLoadingOnSuccess: true,
        backDisabled: false,
        cancelOnBack: true,
        meta: {}
    }, userOptions);

    if (options.showLoading) {
        options.backDisabled ? yield put(showLoadingOverlayAndDisableBack()) : yield put(showLoadingOverlay());
    }

    const task = yield fork(callApi, entityActions, apiFn, options);

    const actionsWatching = [
        entityActions.dismiss().type,
        entityActions._success_().type,
        entityActions._failure_().type
    ];

    if (options.cancelOnBack) {
        actionsWatching.push(NavigationActions.back().type);
    }

    const action = yield take(actionsWatching);

    // IF WE NEED FORCE CANCEL
    if (action.type === entityActions.dismiss().type || action.type === NavigationActions.back().type) {
        task.cancel();
        yield put(hideLoadingOverlay());
    }
};


const callApi = function*(entityActions, apiFn, options = {}) {
    let res; // Api response
    let apiFunction = apiFn;
    let args = {};
    if ('object' === typeof apiFn) {
        apiFunction = apiFn.apiFunction;
        args = apiFn.args;
    }

    try {
        res = yield call(apiFunction, ...args);
    } catch (err) {
        if (options.showLoading) {
            yield put(hideLoadingOverlay());
        }
        yield put(entityActions._failure_(err, options.meta));

        return;
    }

    if (options.showLoading && options.hideLoadingOnSuccess) {
        yield put(hideLoadingOverlay());
    }
    yield put(entityActions._success_(res, options.meta));
};

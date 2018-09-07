import extend from 'lodash/extend';
import { call, put, take } from 'redux-saga/effects';
import ref from '../../utils/ref';
import {
    showLoadingOverlayAndDisableBack,
    showLoadingOverlay,
    hideLoadingOverlay,
    apiAccessTokenExpired,
    apiAccessTokenNotFound

} from '../../features/common/redux/actions';
import normalizeErrorsFromApi from '../../utils/normalizeErrorsFromApi';


export const doSubmit = function*(entityActions, apiFn, userOptions = {}) {
    const options = extend({
        showLoading: true,
        hideLoadingOnSuccess: true,
        alertOnValidationFailed: true,
        meta: {}
    }, userOptions);

    if (options.showLoading) {
        yield put(showLoadingOverlayAndDisableBack());
    }

    yield call(callApi, entityActions, apiFn, options);
};


const callApi = function*(entityActions, apiFn, options = {}) {
    let res;
    let apiFunction = apiFn;
    let args = {};
    if ('object' === typeof apiFn) {
        apiFunction = apiFn.apiFunction;
        args = apiFn.args;
    }

    try {
        res = yield call(apiFunction, ...args);
    } catch (err) {
        const isTokenError = ref(err, 'response.status') === 401;

        if (isTokenError) {
            switch (ref(err, 'response.data.error_description')) {
                case 'The access token provided is invalid.':
                    yield put(apiAccessTokenNotFound({
                        from: entityActions.submit()
                    }));

                    return;
                case 'OAuth2 authentication required':
                    yield put(apiAccessTokenNotFound({
                        from: entityActions.submit()
                    }));

                    return;
                case 'The access token provided has expired.':
                    yield put(apiAccessTokenExpired({
                        from: entityActions.submit()
                    }));
                    yield take('ATTEMPT_RECALL_API');
                    yield call(callApi, entityActions, apiFn, options);
                    return;
            }
        }

        if (options.showLoading) {
            yield put(hideLoadingOverlay());
        }
        if (err.response) {
            const {code, errors} = err.response.data;

            const statusCode = (code) ? code : err.response.status;

            switch (statusCode) {
                case 400: // Validation Failed
                    yield put(entityActions._submitValidationFailed_(err, options.meta));

                    if (options.alertOnValidationFailed && errors) {
                        const errTexts = normalizeErrorsFromApi(errors);
                        errTexts.length && alert(errTexts.join('\r\n'));
                    }

                    return;
            }
        }

        // Unkhown error
        yield put(entityActions._submitFailure_(err, options.meta));
        return;
    }

    if (options.showLoading && options.hideLoadingOnSuccess) {
        yield put(hideLoadingOverlay());
    }
    yield put(entityActions._submitSuccess_(res, options.meta));
};

import { Toast } from 'native-base';
import { channel } from 'redux-saga';
import { take, put, takeLatest } from 'redux-saga/effects';

export const alertChannel = channel();

export function* watchAlertChannel() {
    while (true) {
        const action = yield take(alertChannel);
        yield put(action)
    }
}

export function* watchRequestApiFailure(text = 'Something wrong! during request to server.') {
    yield takeLatest(action => /^(.*)_FAILURE$/.test(action.type), function ({errors, __meta__}) {
        if (__meta__.disabledDisplayGlobalError) {
            return;
        }

        // eslint-disable-next-line no-undef
        if (__DEV__ && errors.response) {
            const {error, error_description} = errors.response.data;
            if (error || error_description) {
                text = error + '\r\n' +  error_description;
            }
        }

        Toast.show({
            text,
            position: 'bottom',
            buttonText: 'Close',
            duration: 3000
        })
    });
}

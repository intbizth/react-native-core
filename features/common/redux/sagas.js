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

/**
 * @param text string|object
 *
 * text object shape : { server: 'some text on server error', client: 'some text on client error' }
 */
export function* watchRequestApiFailure(text = {server: 'Something wrong! during request to server.', client: 'Please check your network connection and try again'}) {
    yield takeLatest(action => /^(.*)_FAILURE$/.test(action.type), function ({ errors, __meta__ }) {
        if (__meta__.disabledDisplayGlobalError) {
            return;
        }

        function getErrorMessage(errors, defaultText) {
            let text = defaultText;

            // eslint-disable-next-line no-undef
            if (!__DEV__) {
                return (!!errors.response)
                    ? text.server || text
                    : text.client || text
            }

            // case can request to server but server error
            if (errors.response) {
                if (errors.response.data) {
                    var errorText = '';
                    const { error, error_description, message } = errors.response.data;
                    if (error) errorText = error;
                    if (message) errorText += message;
                    if (error_description) errorText += '\n' + error_description;

                    return '' !== errorText ? errorText : text.server || text;
                }
            }

            return errors.message || text;
        }

        Toast.show({
            text: getErrorMessage(errors, text),
            position: 'bottom',
            buttonText: 'Close',
            duration: 3000
        })
    });
}

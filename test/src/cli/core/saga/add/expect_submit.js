import { take, fork } from 'redux-saga/effects';
import { doSubmit } from 'react-native-core/api/submit/saga';
import { CREATE_PAGE } from '../constants';
import { createPage } from '../actions';


export const watchCreatePageSubmit = function*() {
    while (true) {
        const submitAction = yield take(CREATE_PAGE.SUBMIT);

        yield fork(doSubmit, createPage, {
            apiFunction: '__SOME_API__',
            args: []
        });

        const action = yield take([
            CREATE_PAGE.SUBMIT_VALIDATION_FAILED,
            CREATE_PAGE.SUBMIT_SUCCESS,
            CREATE_PAGE.SUBMIT_FAILURE,
        ]);

        if (action.type === CREATE_PAGE.SUBMIT_SUCCESS) {
            // do stuff on success
        }
    }
};

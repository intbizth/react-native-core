import { call, takeLatest } from 'redux-saga/effects';
import { doRequest } from 'react-native-core/api/request/saga';
import { GET_PAGE_BY_ID } from '../constants';
import { getPageById } from '../actions';


export const watchGetPageByIdRequest = function*() {
    yield takeLatest(GET_PAGE_BY_ID.REQUEST, function*() {
        // do staff
        yield call(doRequest, getPageById, {
            apiFunction: '__SOME_API__',
            args: []
        })
    });
};

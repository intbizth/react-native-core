import { take, select, fork } from 'redux-saga/effects';
import { doRequest } from 'react-native-core/api/request/saga';
import { FETCH_PAGES, FETCH_PAGES_STATE_KEY } from '../constants';
import { fetchPages } from '../actions';


export const watchFetchPagesPaginate = function*() {
    while (true) {
        const action = yield take([FETCH_PAGES.REQUEST, FETCH_PAGES.LOADMORE, FETCH_PAGES.REFRESH]);
        const data = yield select((state) => state.blank[FETCH_PAGES_STATE_KEY]);

        yield fork(doRequest, fetchPages, {
            apiFunction: '__SOME_API__',
            args: [
                (action.type === FETCH_PAGES.LOADMORE) ? data.pagination.currentPage + 1 : 1
            ]
        }, {showLoading: action.type === FETCH_PAGES.REQUEST})
    }
};

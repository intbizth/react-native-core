import initialState from './initialState';
import {reducer as loading} from './reducers/loading';
import {reducer as locale} from './reducers/locale';
import { updatePageReducer, fetchPagesReducer } from './reducers/page';

const reducers = [
    loading,
    locale,
    updatePageReducer,
    fetchPagesReducer
];

export default function reducer(state = initialState, action = {}) {
    let newState;
    switch (action.type) {
        // Handle cross-topic actions here
        default:
            newState = state;
            break;
    }
    /* istanbul ignore next */
    return reducers.reduce((s, r) => r(s, action), newState);
}

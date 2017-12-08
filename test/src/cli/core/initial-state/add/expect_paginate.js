import { FETCH_PAGES_STATE_KEY, GET_PAGE_BY_ID_STATE_KEY, FETCH_PAGES_WITH_USER_STATE_KEY } from './constants';
import { makeInitialState } from 'react-native-core/api/paginate/reducer';

const initialState = {
    ...makeInitialState(FETCH_PAGES_STATE_KEY),
    [GET_PAGE_BY_ID_STATE_KEY]: null,
    ...makeInitialState(FETCH_PAGES_WITH_USER_STATE_KEY),
};

export default initialState;

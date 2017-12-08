import { FETCH_PAGES_STATE_KEY } from './constants';
import { makeInitialState } from 'react-native-core/api/paginate/reducer';

const initialState = {
    ...makeInitialState(FETCH_PAGES_STATE_KEY),
};

export default initialState;

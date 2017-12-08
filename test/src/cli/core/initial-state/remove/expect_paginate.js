import { GET_PAGE_BY_ID_STATE_KEY } from './constants';
import { makeInitialState } from 'react-native-core/api/paginate/reducer';

const initialState = {
    [GET_PAGE_BY_ID_STATE_KEY]: null,
};

export default initialState;

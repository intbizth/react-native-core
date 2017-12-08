import indexReducer from 'react-native-core/api/paginate/reducer';
import { FETCH_PAGES, FETCH_PAGES_STATE_KEY } from '../constants';

export const fetchPagesReducer = indexReducer(FETCH_PAGES, FETCH_PAGES_STATE_KEY);
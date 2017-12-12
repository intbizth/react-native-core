import requestReducer from 'react-native-core/api/request/reducer';
import { GET_PAGE_BY_ID, GET_PAGE_BY_ID_STATE_KEY } from '../constants';

export const getPageByIdReducer = requestReducer(GET_PAGE_BY_ID, GET_PAGE_BY_ID_STATE_KEY);

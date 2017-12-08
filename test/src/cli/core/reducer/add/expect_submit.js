import submitReducer from 'react-native-core/api/submit/reducer';
import { CREATE_PAGE, CREATE_PAGE_STATE_KEY } from '../constants';

export const createPageReducer = submitReducer(CREATE_PAGE, CREATE_PAGE_STATE_KEY);
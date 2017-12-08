import { createRequestTypes } from 'react-native-core/api/request/action';
import { createPaginateTypes } from 'react-native-core/api/paginate/action';
import { createSubmitTypes } from 'react-native-core/api/submit/action';

export const TRACKING_VIEW_PAGE = createRequestTypes("TRACKING_VIEW_PAGE");

export const FETCH_PAGES = createPaginateTypes("FETCH_PAGES");
export const FETCH_PAGES_STATE_KEY = "pages";
export const CREATE_PAGE = createSubmitTypes("CREATE_PAGE");
export const UPDATE_PAGE = createSubmitTypes("UPDATE_PAGE");

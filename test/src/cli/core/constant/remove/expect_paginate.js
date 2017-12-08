import { createRequestTypes } from 'react-native-core/api/request/action';
import { createSubmitTypes } from 'react-native-core/api/submit/action';

export const GET_PAGE_BY_ID = createRequestTypes("GET_PAGE_BY_ID");
export const GET_PAGE_BY_ID_STATE_KEY = "pageDetail";
export const TRACKING_VIEW_PAGE = createRequestTypes("TRACKING_VIEW_PAGE");

export const CREATE_PAGE = createSubmitTypes("CREATE_PAGE");
export const UPDATE_PAGE = createSubmitTypes("UPDATE_PAGE");

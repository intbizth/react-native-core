import { ACTION_PREFIX } from '../../../constants';
import { createSubmitTypes } from 'react-native-core/api/submit/action';
import { createRequestTypes } from 'react-native-core/api/request/action';
import { createPaginateTypes } from 'react-native-core/api/paginate/action';

export const SHOW_LOADING_OVERLAY = `${ACTION_PREFIX}SHOW_LOADING_OVERLAY`;
export const HIDE_LOADING_OVERLAY = `${ACTION_PREFIX}HIDE_LOADING_OVERLAY`;

export const CHANGE_LOCALE = `${ACTION_PREFIX}CHANGE_LOCALE`;

export const NAVIGATE_TO_ROOT = `${ACTION_PREFIX}NAVIGATE_TO_ROOT`;

export const REDUCER_KEY = 'rn_core_common';
export const CREATE_PAGE = createSubmitTypes("CREATE_PAGE");
export const UPDATE_PAGE = createSubmitTypes("UPDATE_PAGE");
export const UPDATE_PAGE_STATE_KEY = "updatePageResult";
export const GET_PAGE_BY_ID = createRequestTypes("GET_PAGE_BY_ID");
export const FETCH_PAGES = createPaginateTypes("FETCH_PAGES");
export const FETCH_PAGES_STATE_KEY = "pages";

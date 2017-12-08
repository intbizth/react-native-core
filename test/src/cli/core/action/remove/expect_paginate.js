import { AbstractRequestAction } from 'react-native-core/api/request/action';
import { AbstractSubmitAction } from 'react-native-core/api/submit/action';
import { GET_PAGE_BY_ID, TRACKING_VIEW_PAGE, CREATE_PAGE, UPDATE_PAGE } from './constants';

export const getPageById = AbstractRequestAction(GET_PAGE_BY_ID);
export const trackingViewPage = AbstractRequestAction(TRACKING_VIEW_PAGE);

export const createPage = AbstractSubmitAction(CREATE_PAGE);
export const updatePage = AbstractSubmitAction(UPDATE_PAGE);

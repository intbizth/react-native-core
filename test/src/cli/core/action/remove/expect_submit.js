import { AbstractRequestAction } from 'react-native-core/api/request/action';
import { AbstractPaginateAction } from 'react-native-core/api/paginate/action';
import { AbstractSubmitAction } from 'react-native-core/api/submit/action';
import { GET_PAGE_BY_ID, TRACKING_VIEW_PAGE, FETCH_PAGES, CREATE_PAGE } from './constants';

export const getPageById = AbstractRequestAction(GET_PAGE_BY_ID);
export const trackingViewPage = AbstractRequestAction(TRACKING_VIEW_PAGE);

export const fetchPages = AbstractPaginateAction(FETCH_PAGES);
export const createPage = AbstractSubmitAction(CREATE_PAGE);

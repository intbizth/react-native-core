import { AbstractRequestAction } from 'react-native-core/api/request/action';
import { AbstractPaginateAction } from 'react-native-core/api/paginate/action';
import { AbstractSubmitAction } from 'react-native-core/api/submit/action';
import { TRACKING_VIEW_PAGE, FETCH_PAGES, CREATE_PAGE, UPDATE_PAGE } from './constants';

export const trackingViewPage = AbstractRequestAction(TRACKING_VIEW_PAGE);

export const fetchPages = AbstractPaginateAction(FETCH_PAGES);
export const createPage = AbstractSubmitAction(CREATE_PAGE);
export const updatePage = AbstractSubmitAction(UPDATE_PAGE);

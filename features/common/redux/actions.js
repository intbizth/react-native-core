import { AbstractSubmitAction, AbstractRequestAction, AbstractPaginateAction } from 'react-native-core/api/submit/action';
import { CREATE_PAGE, UPDATE_PAGE, GET_PAGE_BY_ID, FETCH_PAGES } from './constants';
export { navigateToRoot } from './reducers/_navigation'
export {
    showLoadingOverlay,
    hideLoadingOverlay,
    showLoadingOverlayAndDisableBack,
} from './reducers/loading';
export {
    changeLocale,
} from './reducers/locale';
export const createPage = AbstractSubmitAction(CREATE_PAGE);
export const updatePage = AbstractSubmitAction(UPDATE_PAGE);
export const getPageById = AbstractRequestAction(GET_PAGE_BY_ID);
export const fetchPages = AbstractPaginateAction(FETCH_PAGES);

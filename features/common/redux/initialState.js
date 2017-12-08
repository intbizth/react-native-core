import { UPDATE_PAGE_STATE_KEY, FETCH_PAGES_STATE_KEY } from './constants';
import { makeInitialState } from 'react-native-core/api/paginate/reducer';
const initialState = {
    loadingOverlayVisible: false,
    loadingOverlayAwareHeader: false,
    locale: null,
    [UPDATE_PAGE_STATE_KEY]: null,
    ...makeInitialState(FETCH_PAGES_STATE_KEY),
};

export default initialState;

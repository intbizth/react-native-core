import { REDUCER_KEY } from './constants';

export const isNowLoading = (state) => state[REDUCER_KEY].loadingOverlayVisible;
export const isDisabledBackButton = (state) => state[REDUCER_KEY].loadingOverlayAwareHeader;
export const getLocaleCode = (state) => state[REDUCER_KEY].locale;

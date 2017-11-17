import {
    SHOW_LOADING_OVERLAY, HIDE_LOADING_OVERLAY
} from '../constants';

export function showLoadingOverlay() {
    return {
        type: SHOW_LOADING_OVERLAY,
    };
}

export function showLoadingOverlayAndDisableBack() {
    return {
        type: SHOW_LOADING_OVERLAY,
        backButtonDisabled: true
    };
}

export function hideLoadingOverlay() {
    return {
        type: HIDE_LOADING_OVERLAY,
    };
}

export function reducer(state, action) {
    switch (action.type) {
        case SHOW_LOADING_OVERLAY:
            return {
                ...state,
                loadingOverlayVisible: true,
                loadingOverlayAwareHeader: !action.backButtonDisabled
            };
        case HIDE_LOADING_OVERLAY:
            return {
                ...state,
                loadingOverlayVisible: false
            };
        default:
            return state;
    }
}

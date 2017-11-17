import {
    CHANGE_LOCALE,
} from '../constants';


export function changeLocale(localeCode) {
    return {
        type: CHANGE_LOCALE,
        localeCode
    };
}

export function reducer(state, action) {
    switch (action.type) {
        case CHANGE_LOCALE:
            return {
                ...state,
                locale: action.localeCode,
            };
        default:
            return state;
    }
}

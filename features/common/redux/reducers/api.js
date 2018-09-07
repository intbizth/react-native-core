import {
    API_RESPONSE_ACCESS_TOKEN_EXPIRED, API_RESPONSE_ACCESS_TOKEN_NOT_FOUND
} from '../constants';

export function apiAccessTokenExpired(payload) {
    return {
        type: API_RESPONSE_ACCESS_TOKEN_EXPIRED,
        payload
    };
}

export function apiAccessTokenNotFound(payload) {
    return {
        type: API_RESPONSE_ACCESS_TOKEN_NOT_FOUND,
        payload
    };
}

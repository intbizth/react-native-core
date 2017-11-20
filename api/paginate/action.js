import { AbstractRequestAction, createRequestTypes } from '../request/action';
import { ACTION_PREFIX } from '../../constants';


const REFRESH = 'REFRESH';
const LOADMORE = 'LOADMORE';

export function createPaginateTypes(base) {
    return {
        ...(createRequestTypes(base)),
        ...([REFRESH, LOADMORE].reduce((acc, type) => {
            acc[type] = `${ACTION_PREFIX}${base}_${type}`;
            return acc
        }, {}))
    };
}


export const AbstractPaginateAction = (entity) => ({
    ... AbstractRequestAction(entity),
    loadmore: (payload) => ({
        type: entity.LOADMORE,
        payload
    }),
    refresh: (payload) => ({
        type: entity.REFRESH,
        payload
    }),
});


// Hacking PhpStorm Resolve path
(() => ({
    REFRESH,
    LOADMORE
}))();

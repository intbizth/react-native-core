import { AbstractRequestAction } from '../request/action';

const REFRESH = 'REFRESH';
const LOADMORE = 'LOADMORE';

export function createPaginateTypes(base) {
    return [REFRESH, LOADMORE].reduce((acc, type) => {
        acc[type] = `${base}_${type}`;
        return acc
    }, {});
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

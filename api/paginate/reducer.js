export class Pagination {
    constructor(response) {
        if (response && response.data) {
            this.hasNextPage = response.data.page < response.data.pages;
            this.currentPage = response.data.page;
        } else {
            this.hasNextPage = false;
            this.currentPage = 1;
        }
    }
}

export function makeInitialState(key) {
    return {
        [key]: {
            data: [],
            pagination: new Pagination,
            isLoadingMore: false,
            isRefreshing: false,
            isLoading: false
        },
    }
}

export default (entity, key) => {
    return  (state = {}, action) => {
        const awarePaginate = !!state[key].pagination;

        switch (action.type) {
            case entity.REQUEST:
                if (!awarePaginate) {
                    return {
                        ...state,
                        [`${key}IsLoading`]: true
                    };
                }

                return {
                    ...state,
                    [key]: {
                        ...state[key],
                        isLoading: true
                    }
                };
            case entity.LOADMORE:
                return {
                    ...state,
                    [key]: {
                        ...state[key],
                        isLoadingMore: true
                    }
                };
            case entity.REFRESH:
                return {
                    ...state,
                    [key]: {
                        ...state[key],
                        isRefreshing: true
                    }
                };
            case entity.SUCCESS: {
                let newState = action.data._embedded.items;

                if (!awarePaginate) {
                    return {
                        ...state,
                        [key]: newState,
                        [`${key}IsLoading`]: false
                    }
                }

                if (action.data.page > 1) {
                    newState = [
                        ...state[key].data,
                        ...action.data._embedded.items
                    ];
                }
                return {
                    ...state,
                    [key]: {
                        data: newState,
                        pagination: new Pagination(action),
                        isLoadingMore: false,
                        isRefreshing: false,
                        isLoading: false
                    }
                };
            }
            case entity.FAILURE: {
                return {
                    ...state,
                    [key]: {
                        ...state[key],
                        isLoading: false
                    }
                };
            }
            default:
                return state;
        }
    }
};

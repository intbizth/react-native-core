import extend from 'lodash/extend';

export default (entity, key, options = {}) => {
    options = extend({
        ownLoading: false
    }, options);

    if (false === options.ownLoading) {
        return (state = {}, action) => {
            switch (action.type) {
                case entity.SUCCESS:
                    return {
                        ...state,
                        [key]: action.data,
                    };
                default:
                    return state;
            }
        }
    }

    const loadingKey = `${key}isLoading`;
    return (state = {}, action) => {
        switch (action.type) {
            case entity.REQUEST:
                return {
                    ...state,
                    [loadingKey]: true
                };
            case entity.SUCCESS:
                return {
                    ...state,
                    [key]: action.data,
                    [loadingKey]: false
                };
            case entity.FAILURE:
            case entity.DISMISS:
                return {
                    ...state,
                    [loadingKey]: false
                };
            default:
                return state;
        }
    }
};

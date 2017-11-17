import isUndefined from 'lodash/isUndefined';

/*
 Better performance than `_.get()`
 see: https://stackoverflow.com/questions/2631001/javascript-test-for-existence-of-nested-object-key
 */
export default function ref(obj, str) {
    str = str.split(".");

    for (let i = 0; i < str.length; i++) {
        if (isUndefined(obj) || !obj.hasOwnProperty(str[i])) {
            return undefined;
        }
        obj = obj[str[i]];
    }

    return obj;
}

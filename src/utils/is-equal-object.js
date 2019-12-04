const isEqual = require('lodash.isequal');

export default function (obj1, obj2) {
    return isEqual(obj1, obj2);
}
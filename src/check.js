'use strict';

var REGEXP_WORD = /[a-zа-я1-9]+/gi;

function init() {
    Object.defineProperty(Object.prototype, 'wrap', {
        enumerable: false,
        value: function (context) {
            var object = {
                value: context
            };
            Object.defineProperty(object, 'isNull', {
                enumerable: false,
                value: isNull
            });
            Object.defineProperty(object, 'check', {
                enumerable: false,
                get: function () {
                    return getInstance(this.value);
                }
            });

            return object;
        }
    });

    Object.defineProperty(Object.prototype, 'check', {
        enumerable: false,
        get: function () {
            return getInstance(this);
        }
    });
};

function getInstance(context) {
    var isInverse = false;
    var structure = Object.create({
        value: context
    });

    Object.defineProperty(structure, 'not', {
        enumerable: false,
        get: function () {
            var struct = Object.create({
                value: context
            });
            defineProperties(struct, context, !isInverse);

            return struct;
        }
    });

    defineProperties(structure, context, isInverse);

    return structure;
}

function defineProperties(structure, context, inverse) {
    Object.defineProperty(structure, 'countProperties', {
        enumerable: false,
        value: countProperties
    });
    Object.defineProperty(structure, 'containsKeys', {
        enumerable: false,
        value: funcResult(containsKeys, structure, [isArray, isObject], inverse)
    });

    Object.defineProperty(structure, 'hasKeys', {
        enumerable: false,
        value: funcResult(hasKeys, structure, [isArray, isObject], inverse)
    });

    Object.defineProperty(structure, 'containsValues', {
        enumerable: false,
        value: funcResult(containsValues, structure, [isArray, isObject], inverse)
    });

    Object.defineProperty(structure, 'hasValues', {
        enumerable: false,
        value: funcResult(hasValues, structure, [isArray, isObject], inverse)
    });

    Object.defineProperty(structure, 'hasValueType', {
        enumerable: false,
        value: funcResult(hasValueType, structure, [isArray, isObject], inverse)
    });

    Object.defineProperty(structure, 'hasLength', {
        enumerable: false,
        value: funcResult(hasLength, structure, [isString, isArray], inverse)
    });

    Object.defineProperty(structure, 'hasParamsCount', {
        enumerable: false,
        value: funcResult(hasParamsCount, structure, [isFunction], inverse)
    });

    Object.defineProperty(structure, 'hasWordsCount', {
        enumerable: false,
        value: funcResult(hasWordsCount, structure, [isString], inverse)
    });
}

function funcResult(func, context, filters, isInverse) {
    return function () {
        var isSuit = filters.some(function (func) {
            return func(getValue(context));
        });

        if (!isSuit) {
            return undefined;
        }

        var result = func.apply(context, arguments);
        return isInverse ? !result
                         : result;
    };
}

function isNull() {
    return this.value === null;
}

function isArray(context) {
    return context instanceof Array;
}

function isObject(context) {
    return context instanceof Object;
}

function isString(context) {
    return typeof context === 'string';
}

function isFunction(context) {
    return context instanceof Function;
}

function containsKeys(keys) {
    return keys.every(function (key) {
        return getValue(this)[key];
    }, this);
}

function hasKeys(keys) {
    return keys.every(function (key) {
        return getValue(this)[key];
    }, this) && keys.length === this.countProperties();
}

function containsValues(values) {
    return values.every(function (value) {
        for (var prop in getValue(this)) {
            if (getValue(this)[prop] === value) {
                return true;
            }
        }

        return false;
    }, this);
}

function hasValues(values) {
    return values.every(function (value) {
        return getValue(this).some(function (val) {
            return val === value;
        });
    }, this) && values.length === this.countProperties();
}

function hasValueType(key, type) {
    return Object.getPrototypeOf(key) === type.prototype;
}

function hasLength(length) {
    return length === getValue(this).length;
}

function hasParamsCount(count) {
    return count === getValue(this).length;
}

function hasWordsCount(count) {
    return count === getValue(this).match(REGEXP_WORD).length;
}

function countProperties() {
    var count = 0;
    for (var key in getValue(this)) {
        if (getValue(this).hasOwnProperty(key)) {
            count++;
        }
    }

    return count;
}

function getValue(obj) {
    return Object.getPrototypeOf(obj).value;
}

exports.init = init;

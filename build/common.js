var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { shallowEqual } from 'shallow-equal-object';
/**
 * # Common Functions
 * Generic utility functions for all to share :)
 */
var Common = /** @class */ (function () {
    function Common() {
    }
    /**
     * ## Infer Type - Generic T
     *
     * Infers the type of `args` to T.
     * @param handler
     */
    Common.handle = function (isValid, args, onSuccess, 
    /** ## On Fail */
    onFail) {
        if (isValid && !!onSuccess) {
            onSuccess(args);
        }
        if (!isValid && !!onFail) {
            onFail(args);
        }
        return isValid;
    };
    /**
       * ## Infer Type - `T[]`
       *
       * Infers args is an IdObject.
       */
    Common.ifArray = function (args, onSuccess, onFail) {
        var isArray = Array.isArray(args);
        return Common.handle(isArray, args, onSuccess, onFail);
    };
    /**
    * ## Infer Type - `string`
    * Infers args is a string.
    */
    Common.ifString = function (args, onSuccess, onFail) {
        var isValid = typeof args === "string";
        return Common.handle(isValid, args, onSuccess, onFail);
    };
    /**
     * ## Infer Type - `{ id: string }`
     *
     * Infers args is an IdObject.
     */
    Common.ifId = function (args, onSuccess, onFail) {
        var isIdObject = typeof args === "object"
            && args["id"]
            && typeof args["id"] === "string";
        return Common.handle(isIdObject, args, onSuccess, onFail);
    };
    /**
     * ## Infer Type - `{ type: T, subtype?: string }`
     *
     * Infers args is a TypedObject.
     */
    Common.ifType = function (args, onSuccess, onFail) {
        var isTypeObject = typeof args === "object"
            && args["type"]
            && typeof args["type"] === "string";
        return Common.handle(isTypeObject, args, onSuccess, onFail);
    };
    /**
     * # isType
     * @param obj
     * @param type
     * @returns
     */
    Common.isType = function (obj, type) {
        return typeof obj === "object" && obj["type"] === type;
    };
    /**
     * ## Infer Type - `{ value: V }`
     *
     * Infers args is a ValueObject.
     */
    Common.ifValue = function (args, onSuccess, onFail) {
        var isTypeObject = typeof args === "object"
            && args["value"];
        return Common.handle(isTypeObject, args, onSuccess, onFail);
    };
    /**
     * Returns true if this is an object
     * @param keys if present, validates that all keys exist on the object and are truthy
     * @returns
     */
    Common.ifObject = function (value, opts) {
        var validObject = typeof value === "object";
        var validKeys = !(opts === null || opts === void 0 ? void 0 : opts.hasKeys);
        if ((opts === null || opts === void 0 ? void 0 : opts.hasKeys) && validObject) {
            var checkKeys = Array.isArray(opts === null || opts === void 0 ? void 0 : opts.hasKeys)
                ? opts === null || opts === void 0 ? void 0 : opts.hasKeys
                : [opts === null || opts === void 0 ? void 0 : opts.hasKeys];
            var valueKeys_1 = Object.keys(value);
            // console.log("Object value", value);
            // console.log("Object Properties", valueKeys);
            // console.log("Key List", checkKeys);
            validKeys = checkKeys
                .every(function (key) { return valueKeys_1.includes(key)
                && !!value[key]; });
        }
        var validPredicate = validKeys && (!(opts === null || opts === void 0 ? void 0 : opts.predicate) || opts.predicate(value));
        var result = validObject
            && validPredicate
            && validKeys;
        return result;
    };
    Common.merge = function (obj) {
        var mergeObjs = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            mergeObjs[_i - 1] = arguments[_i];
        }
        if (typeof obj === "object") {
            mergeObjs.forEach(function (mergeObject) {
                if (typeof mergeObject === "object")
                    for (var key in mergeObject) {
                        obj[key] = mergeObject[key];
                    }
            });
        }
        return obj;
    };
    /**
     * Extends `toString()` by adding whitespace (`\n` and `\t`) and formatting.
     * @param obj object to display
     */
    Common.toReadable = function (obj, opts) {
        var _a = opts || {}, _b = _a.nestedPrefix, nestedPrefix = _b === void 0 ? '' : _b, _c = _a.includeNewLine, includeNewLine = _c === void 0 ? true : _c;
        if (nestedPrefix.length > 5) {
            return "\n< Depth Limit Reached >";
        }
        var newLineChar = includeNewLine ? "\n" : "";
        var readableString = '';
        var objKeys = Object.keys(obj || {});
        objKeys.forEach(function (key, index) {
            var result = "" + nestedPrefix;
            var isObject = typeof obj[key] === "object";
            if (isObject) {
                var readableObject = Common.toReadable(obj[key], { nestedPrefix: nestedPrefix + " ", includeNewLine: includeNewLine });
                result = "" + result + key + ":" + newLineChar + readableObject;
            }
            else {
                if (typeof obj[key] === "string" || typeof obj[key] === "number") {
                    result = "" + result + key + ": " + obj[key];
                }
                else {
                    result = "" + result + key + ": " + obj[key] + " [type " + typeof obj[key] + "]";
                }
            }
            if (index === objKeys.length - 1) {
                // Omit new line on last key
                readableString = "" + readableString + result;
            }
            else {
                readableString = "" + readableString + result + newLineChar;
            }
        });
        return readableString;
    };
    Common.createId = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : ((r & 0x3) | 0x8);
            return v.toString(16);
        });
    };
    /**
       * Use dot notation to access a nested property in `value`
       * @param path
       */
    Common.nestedValue = function (object, path) {
        if (typeof object !== "object")
            return object;
        return path.split('.').reduce(function (obj, i) {
            if (obj && typeof obj === "object")
                return obj[i];
            else
                return obj;
        }, object);
    };
    /**
       * # Shallow Equal
       *
       * Return true, if `objectA` is shallow equal to `objectB`.
       * Pass Custom equality function to `customEqual`.
       * Default equality is `Object.is`
       *
       *  Taken from [shallow-equal-object](https://www.npmjs.com/package/shallow-equal-object) on npm.
       *
       * Options:
       *
       * - `customEqual`: function should return true if the `a` value is equal to `b` value.
       * - `debug`: enable debug info to console log. This log will be disable in production build
       */
    Common.shallowEqual = function (objectA, objectB, options) {
        return shallowEqual(objectA, objectB, options);
    };
    /**
     * Maps object keys to new values.
     *
     * @param obj The object to map
     * @param keyMap Mapped object
     */
    Common.mapKeys = function (obj, keyMap) {
        var mappedKeys = Object.keys(keyMap);
        var result = __assign({}, obj);
        mappedKeys.forEach(function (k1) {
            // Gets mapped key
            var k2 = keyMap[k1];
            // Gets mapped value or defaults to originalValue
            var mappedValue = obj[k2] || obj[k1];
            // Sets original key to mapped value
            result[k1] = mappedValue;
        });
        return result;
    };
    /**
    * @param c
    */
    Common.mapPropertiesToList = function (c) {
        var keys = Object.keys(c);
        var items = keys.map(function (k) {
            var value = c[k];
            if (typeof value !== "string") {
                value = (value === null || value === void 0 ? void 0 : value.toString()) || JSON.stringify(value);
            }
            return {
                id: k,
                title: k,
                subtitle: value,
                divider: true,
            };
        });
        return items;
    };
    return Common;
}());
export { Common };
//# sourceMappingURL=common.js.map
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
import { Common } from './common';
/**
 * # Collection
 * TODO: Determine about distinct collections
 */
var Collection = /** @class */ (function () {
    function Collection(items) {
        var _this = this;
        if (items === void 0) { items = []; }
        this._items = {};
        this._ids = [];
        if (Array.isArray(items)) {
            items.forEach(function (item) {
                if (Common.ifString(item)) {
                    _this._items[item] = item;
                    _this._ids.push(item);
                }
                else if (Common.ifId(item)) {
                    if (_this._ids.includes(item.id)) {
                        throw Error("Cannot have duplicate item Ids in a DistinctCollection");
                    }
                    _this._ids.push(item.id);
                    _this._items[item.id] = item;
                }
            });
        }
        else {
            this._ids = Object.keys(items);
            this._items = items;
        }
    }
    Object.defineProperty(Collection.prototype, "ids", {
        get: function () {
            return this._ids;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Collection.prototype, "items", {
        get: function () {
            return this.toArray();
        },
        enumerable: false,
        configurable: true
    });
    Collection.prototype.add = function (input) {
        var _this = this;
        var items = Collection.extractArray(input);
        items.forEach(function (elem, index) {
            var isString = Common.ifString(elem, function (id) { return _this.upsert(id); });
            var hasId = Common.ifId(elem, function (item) { return _this.upsert(item.id, item); });
            if (!isString && !hasId) {
                _this.upsert(_this._ids.length + "", elem);
            }
        });
        return this._ids.length;
    };
    Collection.prototype.contains = function (item) {
        var _this = this;
        var result = false;
        Common.ifString(item, function (val) { return result = _this._ids.includes(val); });
        Common.ifId(item, function (val) { return _this._ids.includes(val.id); });
        return result;
    };
    Collection.prototype.containsMatch = function (predicate) {
        var _this = this;
        var matchingItem = this._ids.find(function (id) {
            var item = _this._items[id];
            return predicate(item);
        });
        return Boolean(matchingItem);
    };
    Collection.prototype.find = function (predicate, fallback) {
        var _this = this;
        if (typeof predicate === "string") {
            return this._items[predicate];
        }
        else {
            var matchingId = this._ids.find(function (id) {
                var item = _this._items[id];
                return predicate(item);
            });
            if (!!matchingId)
                return this._items[matchingId];
            else
                return fallback;
        }
    };
    /**
     * ## Returns `items` as an Array
     * @param items
     * @param predicate
     * @param mapper
     * @returns
     */
    Collection.flatten = function (items, predicate, mapper) {
        var arr = Collection.extractArray(items);
        if (predicate) {
            arr = arr.filter(predicate);
        }
        if (mapper) {
            return arr.map(mapper);
        }
        return arr;
    };
    Collection.prototype.filter = function (predicate, mapper) {
        var _this = this;
        return this._ids.filter(function (id) {
            var item = _this._items[id];
            return predicate(item);
        }).map(function (id) {
            if (mapper)
                return mapper(_this._items[id]);
            else
                return _this._items[id];
        });
    };
    Collection.prototype.forEach = function (operation) {
        var _this = this;
        try {
            this._ids.forEach(function (id) { return operation(_this._items[id]); });
            return true;
        }
        catch (e) {
            return false;
        }
    };
    Collection.prototype.isEmpty = function () {
        return this._ids.length === 0;
    };
    Collection.prototype.remove = function (item) {
        var itemId = typeof item === "string"
            ? item
            : item["id"] || "";
        var index = this._ids.findIndex(function (id) { return id === itemId; });
        if (index > 0) {
            this._ids.splice(index, 1);
            delete this._items[itemId];
            return true;
        }
        return false;
    };
    Collection.prototype.removeMatch = function (predicate) {
        var _this = this;
        var matches = this._ids.filter(function (id) { return predicate(_this._items[id]); });
        matches.forEach(this.remove);
        return matches.length;
    };
    Collection.prototype.retain = function () {
        var _this = this;
        var e = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            e[_i] = arguments[_i];
        }
        this._ids.forEach(function (id) {
            var item = _this._items[id];
            if (!e.includes(item)) {
                _this.remove(item);
            }
        });
        return this._ids.length;
    };
    Collection.prototype.retainMatch = function (predicate) {
        var _this = this;
        this._ids.forEach(function (id) {
            var item = _this._items[id];
            var matches = predicate(item);
            if (!matches) {
                _this.remove(id);
            }
        });
        return this._ids.length;
    };
    Collection.prototype.size = function () {
        return this._ids.length;
    };
    Collection.prototype.toArray = function (mapper) {
        var _this = this;
        var resultArray = !mapper
            ? this._ids.map(function (id) { return _this._items[id]; })
            : this._ids.map(function (id) { return mapper(_this._items[id]); });
        return resultArray;
    };
    Collection.prototype.clear = function () {
        this._ids = [];
        this._items = {};
    };
    /**
     * Returns a record containing all of the elements in this collection.
     */
    Collection.prototype.toRecord = function (mapper) {
        var _this = this;
        if (mapper) {
            var record_1 = {};
            this._ids.forEach(function (id) {
                var item = _this._items[id];
                record_1[id] = mapper(item);
            });
            return record_1;
        }
        else
            return this._items;
    };
    /**
     * Adds or updates an item.
     * @param id
     * @param newValues
     * @returns number of elements in the collection
     */
    Collection.prototype.upsert = function (id, newValues) {
        var itemPresent = this.contains(id);
        if (!newValues || typeof newValues === "string") {
            this._items[id] = newValues;
        }
        else if (itemPresent && typeof newValues === "object") {
            var oldItem = this._items[id];
            var newItem = __assign(__assign({}, oldItem), newValues);
            this._items[id] = newItem;
        }
        else {
            this._ids.push(id);
            this._items[id] = newValues;
        }
    };
    /**
     * Selects items from state, creates a collection, and let's you manipulate the collection.
     * @param selectItemsFromState
     * @param mapper
     * @returns
     */
    Collection.selector = function (args) {
        return function (state) {
            var items = args.selectState(state);
            var collection = new Collection(items);
            if ((args === null || args === void 0 ? void 0 : args.mapCollection) !== undefined) {
                return args === null || args === void 0 ? void 0 : args.mapCollection(collection);
            }
            else {
                return collection;
            }
        };
    };
    /**
    * Type narrows T, T[], or Collection to an array of T.
    * @param args T, T[], or ICollection<T>
    * @returns T[]
    */
    Collection.extractArray = function (args) {
        if (Array.isArray(args)) {
            return args;
        }
        else if (Collection.typeCheck(args)) {
            return (args === null || args === void 0 ? void 0 : args.toArray) ? args === null || args === void 0 ? void 0 : args.toArray() : [];
        }
        else {
            return [args];
        }
    };
    Collection.typeCheck = function (args) {
        return typeof args === "object" && args["type"] === "collection";
    };
    /**
     * # Returns a Record of ID Keys that are true/false
     * Transforms a list of strings or type literals to a record of truthy values
     * @param list string or Type Literal
     * @param selected string or Type Literal
     */
    Collection.toTruthyIds = function (list, selected) {
        if (selected === void 0) { selected = []; }
        var bools = {};
        list.forEach(function (i) {
            bools[i] = selected.includes(i);
        });
        return bools;
    };
    /**
     * # Returns Array
     * Checks for single values and converts to an array with an optional mapper to convert the result simultaneously.
     * @param args `T | T[]`
     * @param mapper `<R=T>(item: T) => R`
     * @returns `R[]`
     */
    Collection.parseOne = function (args, mapper) {
        var arr = [];
        if (Array.isArray(args)) {
            arr = args;
        }
        else {
            arr = [args];
        }
        if (mapper) {
            return arr.map(function (item) { return mapper(item); });
        }
        return arr;
    };
    /**
     * # Returns Array
     * Checks for records and converts them to an array with an optional mapper to convert the result simultaneously.
     * @param args `T[] | Record<Id,T> `
     * @param mapper `<R=T>(item: T) => R`
     * @returns `R[]`
     */
    Collection.parseRecord = function (args, mapper) {
        var array = Array.isArray(args)
            ? args
            : Object.keys(args).map(function (key) { return args[key]; });
        if (mapper) {
            return array.map(mapper);
        }
        return array;
    };
    return Collection;
}());
export { Collection };
//# sourceMappingURL=collection.js.map
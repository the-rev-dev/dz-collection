import { Common } from "../common";
;
/**
 * TODO: rEMOVE?
 */
var StringCollection = /** @class */ (function () {
    function StringCollection(items) {
        var _this = this;
        if (items === void 0) { items = []; }
        this._items = {};
        this._ids = [];
        if (Array.isArray(items)) {
            items.forEach(function (item) {
                if (_this._ids.includes(_this.idOrString(item))) {
                    // if (this._ids.includes(item.id)) {
                    throw Error("Cannot have duplicate item Ids in a DistinctCollection");
                }
                _this._ids.push(_this.idOrString(item));
                // this._ids.push(item.id);
                _this._items[_this.idOrString(item)] = item;
                // this._items[item.id] = item;
            });
        }
        else {
            this._ids = Object.keys(items);
            this._items = items;
        }
    }
    StringCollection.prototype.idOrString = function (item) {
        if (typeof item === "string" || typeof item === "number") {
            return item + "";
        }
        else {
            return item.id;
        }
    };
    /**
     * Type narrows T, T[], or Collection to an array of T.
     * @param args T, T[], or ICollection<T>
     * @returns T[]
     */
    StringCollection.flatten = function (args) {
        var _a;
        if (Array.isArray(args)) {
            return args;
        }
        else if (typeof args === "object") {
            return (_a = args) === null || _a === void 0 ? void 0 : _a.toArray();
        }
        else {
            return [args];
        }
    };
    StringCollection.prototype.add = function (input) {
        var _this = this;
        var items = StringCollection.flatten(input);
        items.forEach(function (elem) {
            if (_this.contains(elem)) {
                throw Error("Cannot have duplicate Ids in a Distinct Collection.");
            }
            else {
                var id = _this.idOrString(elem);
                _this._items[id] = elem;
                _this._ids.push(id);
            }
        });
        return this._ids.length;
    };
    StringCollection.prototype.contains = function (item) {
        var id = this.idOrString(item);
        return this._ids.includes(id);
    };
    StringCollection.prototype.containsMatch = function (predicate) {
        var _this = this;
        var matchingItem = this._ids.find(function (id) {
            var item = _this._items[id];
            return predicate(item);
        });
        return Boolean(matchingItem);
    };
    StringCollection.prototype.find = function (predicate, fallback) {
        var _this = this;
        if (typeof predicate === "string") {
            return this._items[predicate];
        }
        else {
            var matchingId = this._ids.find(function (id) {
                var item = _this._items[id];
                return predicate(item);
            });
            return !!matchingId
                ? this._items[matchingId]
                : fallback;
        }
    };
    StringCollection.prototype.filter = function (predicate) {
        var _this = this;
        return this._ids.filter(function (id) {
            var item = _this._items[id];
            return predicate(item);
        }).map(function (id) {
            return _this._items[id];
        });
    };
    StringCollection.prototype.forEach = function (operation) {
        var _this = this;
        try {
            this._ids.forEach(function (id) { return operation(_this._items[id]); });
            return true;
        }
        catch (e) {
            return false;
        }
    };
    StringCollection.prototype.isEmpty = function () {
        return this._ids.length === 0;
    };
    StringCollection.prototype.remove = function (item) {
        var itemId = this.idOrString(item);
        var index = this._ids.findIndex(function (id) { return id === itemId; });
        if (index > 0) {
            this._ids.splice(index, 1);
            delete this._items[itemId];
            return true;
        }
        return false;
    };
    StringCollection.prototype.removeMatch = function (predicate) {
        var _this = this;
        var matches = this._ids.filter(function (id) { return predicate(_this._items[id]); });
        matches.forEach(this.remove);
        return matches.length;
    };
    StringCollection.prototype.retain = function () {
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
    StringCollection.prototype.retainMatch = function (predicate) {
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
    StringCollection.prototype.size = function () {
        return this._ids.length;
    };
    StringCollection.prototype.toArray = function (mapper) {
        var _this = this;
        return this._ids.map(function (id) {
            return !!mapper
                ? mapper(_this._items[id])
                : id;
        });
    };
    StringCollection.prototype.clear = function () {
        this._ids = [];
        this._items = {};
    };
    /**
     * Returns a record containing all of the elements in this collection.
     */
    StringCollection.prototype.toRecord = function () {
        return this._items;
    };
    /**
     * Adds or updates an item.
     * TODO: Make this work
     * @param id
     * @param newValues
     * @returns number of elements in the collection
     */
    StringCollection.prototype.upsert = function (id, newValues) {
        if (Common.ifString(newValues)) {
            this.add(id);
        }
    };
    return StringCollection;
}());
export { StringCollection };
//# sourceMappingURL=stringCollection.js.map
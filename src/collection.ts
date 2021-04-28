import { IdObject, Operation, Filter, StateSelect, Mapper, ObjectId } from "./types";
import { ICollection } from "./iCollection";
import { Common } from './common'

/**
 * # Collection
 * TODO: Determine about distinct collections
 */
export class Collection<E extends {} | string> implements ICollection<E>{
    type: "collection";
    private _items: Record<string, E>;
    private _ids: ObjectId[];

    get ids() {
        return this._ids;
    }

    get items() {
        return this.toArray();
    }

    constructor(items: Record<string, E> | E[] = []) {

        this._items = {};
        this._ids = [];

        if (Array.isArray(items)) {

            items.forEach(item => {

                if (Common.ifString(item)) {
                    this._items[item] = item;
                    this._ids.push(item);
                } else if (Common.ifId(item)) {
                    if (this._ids.includes(item.id)) {
                        throw Error("Cannot have duplicate item Ids in a DistinctCollection");
                    }
                    this._ids.push(item.id);
                    this._items[item.id] = item;
                }
            })

        } else {
            this._ids = Object.keys(items);
            this._items = items;
        }
    }

    add(input: E | E[] | ICollection<E>): number {
        const items = Collection.extractArray(input);
        items.forEach((elem, index) => {
            const isString = Common.ifString<E>(elem,
                id => this.upsert(id)
            );
            const hasId = Common.ifId<E>(elem,
                item => this.upsert(item.id, item)
            );

            if (!isString && !hasId) {
                this.upsert(this._ids.length + "", elem)
            }
        });

        return this._ids.length;
    }

    contains(item: E | ObjectId): boolean {
        let result = false;

        Common.ifString(
            item,
            val => result = this._ids.includes(val)
        );

        Common.ifId(
            item,
            val => this._ids.includes(val.id)
        );

        return result;
    }

    containsMatch(predicate: Filter<E>): boolean {
        const matchingItem = this._ids.find(id => {
            const item = this._items[id];
            return predicate(item);
        });
        return Boolean(matchingItem);
    }

    find<R = E>(predicate: Filter<E> | string, fallback?: R): R {
        if (typeof predicate === "string") {
            return this._items[predicate] as any;
        } else {
            const matchingId = this._ids.find(id => {
                const item = this._items[id];
                return predicate(item);
            });
            if (!!matchingId)
                return this._items[matchingId] as any;
            else
                return fallback;
        }
    }

    /**
     * ## Returns `items` as an Array
     * @param items 
     * @param predicate 
     * @param mapper 
     * @returns 
     */
    static flatten<T, R = T>(items: T | T[], predicate?: Filter<T>, mapper?: (item: T) => R) {
        let arr = Collection.extractArray(items);

        if (predicate) {
            arr = arr.filter(predicate);
        }

        if (mapper) {
            return arr.map(mapper);
        }
        return arr;
    }

    filter<R = E>(predicate: Filter<E>, mapper?: Mapper<R, E>): R[] {

        return this._ids.filter(id => {
            const item = this._items[id];
            return predicate(item);
        }).map(id => {
            if (mapper)
                return mapper(this._items[id]) as R;
            else
                return this._items[id] as unknown as R;
        });
    }

    forEach(operation: Operation<E>): boolean {
        try {
            this._ids.forEach(id => operation(this._items[id]));
            return true;
        } catch (e) {
            return false;
        }
    }

    isEmpty(): boolean {
        return this._ids.length === 0;
    }

    remove(item: E | ObjectId): boolean {
        const itemId = typeof item === "string"
            ? item
            : item["id"] || "";

        const index = this._ids.findIndex(id => id === itemId);
        if (index > 0) {
            this._ids.splice(index, 1);
            delete this._items[itemId];
            return true;
        }
        return false;
    }

    removeMatch(predicate: Filter<E>): number {
        const matches = this._ids.filter(id => predicate(this._items[id]));
        matches.forEach(this.remove);
        return matches.length;
    }

    retain(...e: E[]): number {
        this._ids.forEach(id => {
            const item = this._items[id];
            if (!e.includes(item as any)) {
                this.remove(item);
            }
        });
        return this._ids.length;
    }

    retainMatch(predicate: Filter<E>) {
        this._ids.forEach(id => {
            const item = this._items[id];
            const matches = predicate(item);
            if (!matches) {
                this.remove(id);
            }
        });
        return this._ids.length;
    }

    size() {
        return this._ids.length;
    }

    toArray<R = E>(mapper?: (item: E) => R): R[] {
        const resultArray: R[] = !mapper
            ? this._ids.map(id => this._items[id] as unknown as R)
            : this._ids.map(id => mapper(this._items[id]));
        return resultArray;
    }

    clear() {
        this._ids = [];
        this._items = {}
    }


    /**
     * Returns a record containing all of the elements in this collection.
     */
    toRecord<Types extends string = string, R = E>(mapper?: (item: E) => R): Record<Types, R> {
        if (mapper) {
            const record: Record<string, R> = {};
            this._ids.forEach(id => {
                const item = this._items[id];
                record[id] = mapper(item);
            });
            return record;
        } else
            return this._items as unknown as Record<string, R>;
    }


    /**
     * Adds or updates an item.
     * @param id 
     * @param newValues 
     * @returns number of elements in the collection
     */
    upsert(id: string | ObjectId, newValues?: E) {
        const itemPresent = this.contains(id);
        if (!newValues || typeof newValues === "string") {
            this._items[id] = newValues;

        } else if (itemPresent && typeof newValues === "object") {
            const oldItem: {} = this._items[id];
            const newItem = { ...oldItem, ...newValues as {} };
            this._items[id] = newItem as E;
        } else {
            this._ids.push(id);
            this._items[id] = newValues as E;
        }
    }


    /**
     * Selects items from state, creates a collection, and let's you manipulate the collection.
     * @param selectItemsFromState 
     * @param mapper 
     * @returns 
     */
    public static selector<State extends Record<string, T> | T[], T extends IdObject = IdObject, R = Collection<T>>(
        args: { selectState: StateSelect<State>, mapCollection?: Mapper<R, Collection<T>> }): (state) => R {
        return (state) => {
            const items = args.selectState(state);
            const collection = new Collection(items);
            if (args?.mapCollection !== undefined) {
                return args?.mapCollection(collection);
            } else {
                return collection as unknown as R;
            }
        }
    }

    /**
    * Type narrows T, T[], or Collection to an array of T.
    * @param args T, T[], or ICollection<T>
    * @returns T[]
    */
    static extractArray<T>(args: T | T[] | ICollection<T>): T[] {
        if (Array.isArray(args)) {

            return args;
        } else if (Collection.typeCheck(args)) {

            return args?.toArray ? args?.toArray() : [];
        } else {

            return [args];
        }
    }

    static typeCheck<T = any>(args): args is ICollection<T> {
        return typeof args === "object" && args["type"] === "collection";
    }

    /**
     * # Returns a Record of ID Keys that are true/false 
     * Transforms a list of strings or type literals to a record of truthy values
     * @param list string or Type Literal
     * @param selected string or Type Literal
     */
    public static toTruthyIds<T extends string>(list: T[], selected: string[] = []) {
        const bools: Record<string, boolean> = {};

        list.forEach(i => {
            bools[i] = selected.includes(i);
        });
        return bools as Record<T, boolean>;
    }


    /**
     * # Returns Array
     * Checks for single values and converts to an array with an optional mapper to convert the result simultaneously.
     * @param args `T | T[]`
     * @param mapper `<R=T>(item: T) => R`
     * @returns `R[]`
     */
    public static parseOne<T, R = T>(args: T | T[], mapper?: (item: T) => R): R[] {
        let arr = []
        if (Array.isArray(args)) {
            arr = args
        } else {
            arr = [args];
        }
        if (mapper) {
            return arr.map(item => mapper(item));
        }
        return arr;
    }


    /**
     * # Returns Array
     * Checks for records and converts them to an array with an optional mapper to convert the result simultaneously.
     * @param args `T[] | Record<Id,T> `
     * @param mapper `<R=T>(item: T) => R`
     * @returns `R[]`
     */
    public static parseRecord<T, R = T>(args: T[] | Record<string, T>, mapper?: (item: T) => R) {
        let array = Array.isArray(args)
            ? args
            : Object.keys(args).map(key => args[key]);

        if (mapper) {
            return array.map(mapper) as R[]
        }

        return array as unknown as R[];
    }
}

import { IdObject, Operation, Filter, StateSelect, Mapper, ObjectId } from "./types";
import { ICollection } from "./iCollection";
/**
 * # Collection
 * TODO: Determine about distinct collections
 */
export declare class Collection<E extends {} | string> implements ICollection<E> {
    type: "collection";
    private _items;
    private _ids;
    get ids(): ObjectId[];
    get items(): E[];
    constructor(items?: Record<string, E> | E[]);
    add(input: E | E[] | ICollection<E>): number;
    contains(item: E | ObjectId): boolean;
    containsMatch(predicate: Filter<E>): boolean;
    find<R = E>(predicate: Filter<E> | string, fallback?: R): R;
    /**
     * ## Returns `items` as an Array
     * @param items
     * @param predicate
     * @param mapper
     * @returns
     */
    static flatten<T, R = T>(items: T | T[], predicate?: Filter<T>, mapper?: (item: T) => R): T[] | R[];
    filter<R = E>(predicate: Filter<E>, mapper?: Mapper<R, E>): R[];
    forEach(operation: Operation<E>): boolean;
    isEmpty(): boolean;
    remove(item: E | ObjectId): boolean;
    removeMatch(predicate: Filter<E>): number;
    retain(...e: E[]): number;
    retainMatch(predicate: Filter<E>): number;
    size(): number;
    toArray<R = E>(mapper?: (item: E) => R): R[];
    clear(): void;
    /**
     * Returns a record containing all of the elements in this collection.
     */
    toRecord<Types extends string = string, R = E>(mapper?: (item: E) => R): Record<Types, R>;
    /**
     * Adds or updates an item.
     * @param id
     * @param newValues
     * @returns number of elements in the collection
     */
    upsert(id: string | ObjectId, newValues?: E): void;
    /**
     * Selects items from state, creates a collection, and let's you manipulate the collection.
     * @param selectItemsFromState
     * @param mapper
     * @returns
     */
    static selector<State extends Record<string, T> | T[], T extends IdObject = IdObject, R = Collection<T>>(args: {
        selectState: StateSelect<State>;
        mapCollection?: Mapper<R, Collection<T>>;
    }): (state: any) => R;
    /**
    * Type narrows T, T[], or Collection to an array of T.
    * @param args T, T[], or ICollection<T>
    * @returns T[]
    */
    static extractArray<T>(args: T | T[] | ICollection<T>): T[];
    static typeCheck<T = any>(args: any): args is ICollection<T>;
    /**
     * # Returns a Record of ID Keys that are true/false
     * Transforms a list of strings or type literals to a record of truthy values
     * @param list string or Type Literal
     * @param selected string or Type Literal
     */
    static toTruthyIds<T extends string>(list: T[], selected?: string[]): Record<T, boolean>;
    /**
     * # Returns Array
     * Checks for single values and converts to an array with an optional mapper to convert the result simultaneously.
     * @param args `T | T[]`
     * @param mapper `<R=T>(item: T) => R`
     * @returns `R[]`
     */
    static parseOne<T, R = T>(args: T | T[], mapper?: (item: T) => R): R[];
    /**
     * # Returns Array
     * Checks for records and converts them to an array with an optional mapper to convert the result simultaneously.
     * @param args `T[] | Record<Id,T> `
     * @param mapper `<R=T>(item: T) => R`
     * @returns `R[]`
     */
    static parseRecord<T, R = T>(args: T[] | Record<string, T>, mapper?: (item: T) => R): R[];
}
//# sourceMappingURL=collection.d.ts.map
import { Operation, Filter, ObjectId } from "../types";
import { ICollection } from "../iCollection";
/**
 * TODO: rEMOVE?
 */
export declare class StringCollection implements ICollection<string> {
    type: "collection";
    private _items;
    private _ids;
    constructor(items?: Record<string, string> | string[]);
    private idOrString;
    /**
     * Type narrows T, T[], or Collection to an array of T.
     * @param args T, T[], or ICollection<T>
     * @returns T[]
     */
    static flatten<T>(args: T | T[] | ICollection<T>): T[];
    add(input: string | string[] | ICollection<string>): number;
    contains(item: string | string): boolean;
    containsMatch(predicate: Filter<string>): boolean;
    find(predicate: Filter<string> | string, fallback?: string): string;
    filter(predicate: Filter<string>): string[];
    forEach(operation: Operation<string>): boolean;
    isEmpty(): boolean;
    remove(item: ObjectId | string): boolean;
    removeMatch(predicate: Filter<string>): number;
    retain(...e: string[]): number;
    retainMatch(predicate: Filter<string>): number;
    size(): number;
    toArray<R = string>(mapper?: (item: string) => R): R[];
    clear(): void;
    /**
     * Returns a record containing all of the elements in this collection.
     */
    toRecord<T extends string>(): Record<T, string>;
    /**
     * Adds or updates an item.
     * TODO: Make this work
     * @param id
     * @param newValues
     * @returns number of elements in the collection
     */
    upsert(id: string, newValues?: Partial<string>): void;
}
//# sourceMappingURL=stringCollection.d.ts.map
import { Filter, Operation, Mapper } from "./types";
/**
 * TODO: size() => get  length
 */
export interface ICollection<E> {
    type: "collection";
    /**
     * Ensures this collection contains the specified element(s).
     * @param e the element(s) to add
     * @returns number of elements in the collection
     */
    add(...e: E[]): number;
    add(c: ICollection<E>): number;
    /**
     * Removes all elements from this collection.
     */
    clear(): void;
    /**
     * Returns `true` if this collection contains the specified element(s).
     * @param e element
     */
    contains(...e: E[]): boolean;
    /**
    * Returns `true` if this collection contains an element that matches the given predicate.
    * @param e element
    */
    containsMatch(predicate: Filter<E>): boolean;
    /**
     * Performs the given operation for each element of the collection
     * @param o operation to perform
     */
    forEach(o: Operation<E>): boolean;
    /**
     * Returns `true` if the collection is empty.
     */
    isEmpty(): boolean;
    /**
     * Returns all elements that match the specified predicate.
     * @param predicate match on
     */
    filter(predicate: Filter<E>): E[];
    /**
     * Returns the first element that matches the specified predicate.
     * @param predicate match on
     * @param fallback value to return
     * @returns matching element or undefined if none match
     */
    find(predicate: Filter<E>, fallback?: E): E | undefined;
    /**
     * Removes the specified element(s) from this collection, if present.
     * @param e element(s) to remove
     * @returns `true` if item was removed
     */
    remove(...e: E[]): boolean;
    /**
     * Removes all elements of this collection that satisfy the given predicate.
     * @param predicate match on
     * @returns number of elements removed
     */
    removeMatch(predicate: Filter<E>): number;
    /**
     * Retains only the elements in this collection that are contained in the parameters.
     * @param e elements to retain
     * @returns new collection size
     */
    retain(...e: E[]): number;
    /**
     * Retains only the elements in this collection that match the given predicate.
     * @param predicate match on
     * @returns new collection size
     */
    retainMatch(predicate: Filter<E>): number;
    /**
     * Returns the number of elements in the collection.
     */
    size(): number;
    /**
     * Returns an array containing all of the elements in this collection.
     */
    toArray<R = E>(mapper?: Mapper<R>): R[];
}
//# sourceMappingURL=iCollection.d.ts.map
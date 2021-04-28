import { Value } from "./abstractValue";;
import { IdObject, Operation, Filter,ObjectId } from "./types";
import { ICollection } from "./iCollection";


/**
 * TODO: Determine about distinct collections
 */

export class StringCollection implements ICollection<string>{
    type: "collection";
    private _items: Record<string, string>;
    private _ids: ObjectId[];

    constructor(items: Record<string, string> | string[] = []) {
        this._items = {};
        this._ids = [];

        if (Array.isArray(items)) {
            items.forEach(item => {
                if (this._ids.includes(this.idOrString(item))) {
                    // if (this._ids.includes(item.id)) {
                    throw Error("Cannot have duplicate item Ids in a DistinctCollection");
                }
                this._ids.push(this.idOrString(item));
                // this._ids.push(item.id);
                this._items[this.idOrString(item)] = item;
                // this._items[item.id] = item;
            })

        } else {
            this._ids = Object.keys(items);
            this._items = items;
        }
    }

    private idOrString(item: IdObject | ObjectId) {
        if (typeof item === "string" || typeof item === "number") {
            return item + "";
        } else {
            return item.id;
        }
    }

    /**
     * Type narrows T, T[], or Collection to an array of T.
     * @param args T, T[], or ICollection<T>
     * @returns T[]
     */
    static flatten<T>(args: T | T[] | ICollection<T>): T[] {
        if (Array.isArray(args)) {
            return args;
        } else if (typeof args === "object") {
            return (args as ICollection<T>)?.toArray();
        } else {
            return [args];
        }
    }

    add(input: string | string[] | ICollection<string>): number {

        const items = StringCollection.flatten(input);

        items.forEach(elem => {
            if (this.contains(elem)) {
                throw Error("Cannot have duplicate Ids in a Distinct Collection.");
            } else {
                const id = this.idOrString(elem);
                this._items[id] = elem;
                this._ids.push(id);
            }
        });
        return this._ids.length;
    }

    contains(item: string | string): boolean {
        const id = this.idOrString(item);
        return this._ids.includes(id);
    }

    containsMatch(predicate: Filter<string>): boolean {
        const matchingItem = this._ids.find(id => {
            const item = this._items[id];
            return predicate(item);
        });
        return Boolean(matchingItem);
    }

    find(predicate: Filter<string> | string, fallback?: string): string {
        if (typeof predicate === "string") {
            return this._items[predicate];
        } else {
            const matchingId = this._ids.find(id => {
                const item = this._items[id];
                return predicate(item);
            });
            return !!matchingId
                ? this._items[matchingId]
                : fallback;
        }
    }

    filter(predicate: Filter<string>): string[] {
        return this._ids.filter(id => {
            const item = this._items[id];
            return predicate(item);
        }).map(id =>
            this._items[id]
        );
    }

    forEach(operation: Operation<string>): boolean {
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

    remove(item: ObjectId | string): boolean {
        const itemId = this.idOrString(item);

        const index = this._ids.findIndex(id => id === itemId);
        if (index > 0) {
            this._ids.splice(index, 1);
            delete this._items[itemId];
            return true;
        }
        return false;
    }

    removeMatch(predicate: Filter<string>): number {
        const matches = this._ids.filter(id => predicate(this._items[id]));
        matches.forEach(this.remove);
        return matches.length;
    }

    retain(...e: string[]): number {
        this._ids.forEach(id => {
            const item = this._items[id];
            if (!e.includes(item)) {
                this.remove(item);
            }
        });
        return this._ids.length;
    }

    retainMatch(predicate: Filter<string>) {
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

    toArray<R = string>(mapper?: (item: string) => R): R[] {
        return this._ids.map(id => {
            return !!mapper
                ? mapper(this._items[id])
                : id as unknown as R;
        });
    }

    clear() {
        this._ids = [];
        this._items = {}
    }

    /**
     * Returns a record containing all of the elements in this collection.
     */
    toRecord<T extends string>(): Record<T, string> {
        return this._items;
    }

    /**
     * Adds or updates an item.
     * TODO: Make this work
     * @param id 
     * @param newValues 
     * @returns number of elements in the collection
     */
    upsert(id: string, newValues?: Partial<string>) {
        if (Value.ifString(newValues)) {
            this.add(id as string);
        }
    }



}

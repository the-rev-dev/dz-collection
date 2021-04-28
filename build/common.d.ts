import { Filter, IdObject, TypedObject, ValueObject } from './types';
/**
 * Cannot import Pipe due to circular dependency
 */
export interface AbstractValueProps<T> {
    value?: T;
}
/**
 * # Common Functions
 * Generic utility functions for all to share :)
 */
export declare class Common<V> {
    /**
     * ## Infer Type - Generic T
     *
     * Infers the type of `args` to T.
     * @param handler
     */
    static handle<T>(isValid: boolean, args: any, onSuccess?: (arg: T) => void, 
    /** ## On Fail */
    onFail?: (arg: any, err?: any) => void): args is T;
    /**
       * ## Infer Type - `T[]`
       *
       * Infers args is an IdObject.
       */
    static ifArray<T>(args: any, onSuccess?: (arg: T[]) => void, onFail?: (arg: T, err?: any) => void): args is T[];
    /**
    * ## Infer Type - `string`
    * Infers args is a string.
    */
    static ifString<T = string>(args: any, onSuccess?: (arg: T & string) => void, onFail?: (arg: T & string, err?: any) => void): args is string;
    /**
     * ## Infer Type - `{ id: string }`
     *
     * Infers args is an IdObject.
     */
    static ifId<T = IdObject>(args: any, onSuccess?: (arg: T & IdObject) => void, onFail?: (arg: T & IdObject, err?: any) => void): args is IdObject & T;
    /**
     * ## Infer Type - `{ type: T, subtype?: string }`
     *
     * Infers args is a TypedObject.
     */
    static ifType<Types extends string = string, Subtypes extends string = string>(args: any, onSuccess?: (arg: TypedObject<Types, Subtypes>) => void, onFail?: (arg: TypedObject<Types, Subtypes>, err?: any) => void): args is TypedObject<Types>;
    /**
     * # isType
     * @param obj
     * @param type
     * @returns
     */
    static isType<R extends {
        type: Type;
    }, Type extends string = string>(obj: any, type: Type): obj is R;
    /**
     * ## Infer Type - `{ value: V }`
     *
     * Infers args is a ValueObject.
     */
    static ifValue<Value = any>(args: any, onSuccess?: (arg: ValueObject<Value>) => void, onFail?: (arg: ValueObject<Value>, err?: any) => void): args is ValueObject<Value>;
    /**
     * Returns true if this is an object
     * @param keys if present, validates that all keys exist on the object and are truthy
     * @returns
     */
    static ifObject(value: any, opts?: {
        hasKeys?: string[] | string;
        predicate?: Filter<any>;
    }): boolean;
    /**
     * Maps object keys to new values.
     *
     * @param obj The object to map
     * @param keyMap Mapped object
     */
    static mapKeys: <T extends {}>(obj: T, keyMap: Record<keyof T, keyof T>) => T;
    /**
    * @param c
    */
    static mapPropertiesToList: <C>(c: C) => {
        id: string;
        title: string;
        subtitle: any;
        divider: boolean;
    }[];
    static merge<T, M extends {}>(obj: T, ...mergeObjs: M[]): T;
    /**
     * Extends `toString()` by adding whitespace (`\n` and `\t`) and formatting.
     * @param obj object to display
     */
    static toReadable<T extends Object = {}>(obj: T, opts?: {
        /** Spacing after nested objects */
        nestedPrefix?: string;
        includeNewLine?: boolean;
    }): string;
    static createId(): string;
    /**
       * Use dot notation to access a nested property in `value`
       * @param path
       */
    static nestedValue<R>(object: any, path: string): any;
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
    static shallowEqual(objectA: any, objectB: any, options?: {
        customEqual?: (<T>(a: T, b: T) => boolean) | undefined;
        debug?: true | undefined;
        console?: Pick<Console, "log" | "group" | "groupEnd"> | undefined;
    } | undefined): boolean;
}
//# sourceMappingURL=common.d.ts.map
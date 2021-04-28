import { shallowEqual } from 'shallow-equal-object';
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
export class Common<V>{

    /**
     * ## Infer Type - Generic T
     * 
     * Infers the type of `args` to T.
     * @param handler 
     */
    static handle<T>(
        isValid: boolean,
        args,
        onSuccess?: (arg: T) => void,
        /** ## On Fail */
        onFail?: (arg, err?) => void
    ): args is T {

        if (isValid && !!onSuccess) {
            onSuccess(args)
        }

        if (!isValid && !!onFail) {
            onFail(args)
        }

        return isValid;
    }

    /**
       * ## Infer Type - `T[]`
       * 
       * Infers args is an IdObject.
       */
    static ifArray<T>(
        args,
        onSuccess?: (arg: T[]) => void,
        onFail?: (arg: T, err?) => void
    ): args is T[] {

        const isArray = Array.isArray(args);

        return Common.handle(
            isArray,
            args,
            onSuccess,
            onFail
        )
    }

    /**
    * ## Infer Type - `string`
    * Infers args is a string.
    */
    static ifString<T = string>(
        args,
        onSuccess?: (arg: T & string) => void,
        onFail?: (arg: T & string, err?) => void
    ): args is string {

        const isValid = typeof args === "string";

        return Common.handle(
            isValid,
            args,
            onSuccess,
            onFail
        )
    }


    /**
     * ## Infer Type - `{ id: string }`
     * 
     * Infers args is an IdObject.
     */
    static ifId<T = IdObject>(
        args,
        onSuccess?: (arg: T & IdObject) => void,
        onFail?: (arg: T & IdObject, err?) => void
    ): args is IdObject & T {

        const isIdObject = typeof args === "object"
            && args["id"]
            && typeof args["id"] === "string";

        return Common.handle(
            isIdObject,
            args,
            onSuccess,
            onFail
        )
    }

    /**
     * ## Infer Type - `{ type: T, subtype?: string }`
     * 
     * Infers args is a TypedObject. 
     */
    static ifType<Types extends string = string, Subtypes extends string = string>(
        args,
        onSuccess?: (arg: TypedObject<Types, Subtypes>) => void,
        onFail?: (arg: TypedObject<Types, Subtypes>, err?) => void
    ): args is TypedObject<Types> {
        const isTypeObject = typeof args === "object"
            && args["type"]
            && typeof args["type"] === "string";

        return Common.handle(
            isTypeObject,
            args,
            onSuccess,
            onFail
        );
    }

    /**
     * # isType
     * @param obj 
     * @param type 
     * @returns 
     */
    public static isType<R extends { type: Type }, Type extends string = string>(obj: any, type: Type): obj is R {
        return typeof obj === "object" && obj["type"] === type;
    }

    /**
     * ## Infer Type - `{ value: V }`
     * 
     * Infers args is a ValueObject. 
     */
    static ifValue<Value = any>(
        args,
        onSuccess?: (arg: ValueObject<Value>) => void,
        onFail?: (arg: ValueObject<Value>, err?) => void
    ): args is ValueObject<Value> {
        const isTypeObject = typeof args === "object"
            && args["value"]

        return Common.handle(
            isTypeObject,
            args,
            onSuccess,
            onFail
        );
    }

    /**
     * Returns true if this is an object
     * @param keys if present, validates that all keys exist on the object and are truthy
     * @returns 
     */
    static ifObject(value, opts?: { hasKeys?: string[] | string, predicate?: Filter<any> }) {
        let validObject = typeof value === "object"
        let validKeys = !opts?.hasKeys;

        if (opts?.hasKeys && validObject) {
            const checkKeys = Array.isArray(opts?.hasKeys)
                ? opts?.hasKeys
                : [opts?.hasKeys];

            const valueKeys = Object.keys(value);
            // console.log("Object value", value);
            // console.log("Object Properties", valueKeys);
            // console.log("Key List", checkKeys);
            validKeys = checkKeys
                .every(key => valueKeys.includes(key)
                    && !!value[key]
                );

        }

        let validPredicate = validKeys && (!opts?.predicate || opts.predicate(value))

        const result = validObject
            && validPredicate
            && validKeys;
        return result;
    }

    /**
     * Maps object keys to new values. 
     * 
     * @param obj The object to map
     * @param keyMap Mapped object
     */
    public static mapKeys = <T extends {}>(obj: T, keyMap: Record<keyof T, keyof T>) => {
        const mappedKeys = Object.keys(keyMap);
        const result = { ...obj };

        mappedKeys.forEach((k1) => {
            // Gets mapped key
            const k2: keyof T = keyMap[k1];

            // Gets mapped value or defaults to originalValue
            const mappedValue = obj[k2] || obj[k1];

            // Sets original key to mapped value
            result[k1] = mappedValue;
        });

        return result;
    }

    /**
    * @param c
    */
    static mapPropertiesToList = <C>(c: C) => {
        const keys = Object.keys(c);

        const items = keys.map(k => {

            let value = c[k];

            if (typeof value !== "string") {
                value = value?.toString() || JSON.stringify(value);
            }

            return {
                id: k,
                title: k,
                subtitle: value,
                divider: true,
            }
        });

        return items;
    }

    public static merge<T, M extends {}>(obj: T, ...mergeObjs: M[]) {
        if (typeof obj === "object") {
            mergeObjs.forEach(mergeObject => {
                if (typeof mergeObject === "object")
                    for (let key in mergeObject) {
                        (obj as any)[key] = mergeObject[key];
                    }
            })
        }
        return obj;
    }

    /**
     * Extends `toString()` by adding whitespace (`\n` and `\t`) and formatting. 
     * @param obj object to display
     */
    public static toReadable<T extends Object = {}>(obj: T, opts?: {
        /** Spacing after nested objects */
        nestedPrefix?: string;
        includeNewLine?: boolean;
    }): string {

        const { nestedPrefix = '', includeNewLine = true } = opts || {};


        if (nestedPrefix.length > 5) {
            return "\n< Depth Limit Reached >"
        }

        let newLineChar = includeNewLine ? `\n` : "";
        let readableString = '';
        let objKeys = Object.keys(obj || {});

        objKeys.forEach(function (key, index) {
            let result = `${nestedPrefix}`

            const isObject = typeof (obj as any)[key] === "object"

            if (isObject) {
                const readableObject = Common.toReadable((obj as any)[key], { nestedPrefix: `${nestedPrefix} `, includeNewLine });

                result = `${result}${key}:${newLineChar}${readableObject}`;

            } else {
                if (typeof (obj as any)[key] === "string" || typeof (obj as any)[key] === "number") {
                    result = `${result}${key}: ${(obj as any)[key]}`;

                } else {
                    result = `${result}${key}: ${(obj as any)[key]} [type ${typeof (obj as any)[key]}]`;
                }
            }

            if (index === objKeys.length - 1) {
                // Omit new line on last key
                readableString = `${readableString}${result}`
            } else {
                readableString = `${readableString}${result}${newLineChar}`
            }

        });
        return readableString;
    }

    static createId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : ((r & 0x3) | 0x8);
            return v.toString(16);
        });
    }


    
    /**
       * Use dot notation to access a nested property in `value`
       * @param path 
       */
    static nestedValue<R>(object, path: string) {
        if (typeof object !== "object")
            return object;

        return path.split('.').reduce((obj, i) => {
            if (obj && typeof obj === "object")
                return obj[i];
            else return obj;
        }, object) as R;
    }

    
    
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
    public static shallowEqual(objectA: any, objectB: any, options?: {
        customEqual?: (<T>(a: T, b: T) => boolean) | undefined;
        debug?: true | undefined;
        console?: Pick<Console, "log" | "group" | "groupEnd"> | undefined;
    } | undefined) {
        return shallowEqual(objectA, objectB, options);
    }


}

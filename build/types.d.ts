export interface AnyProps {
    [index: string]: any;
}
export declare type IdObject<T = {}> = T & {
    id: ObjectId;
};
export interface TypedObject<Type extends string = string, Subtypes extends string = string> {
    type: Type;
    subtype: Subtypes;
}
export interface SubTyptedObject<SubType extends string = string> {
    subtype: SubType;
}
export interface ValueObject<Value> {
    value: Value;
}
export interface Filter<E> {
    (e: E): boolean;
}
export declare type Handlers<T> = [(arg: T) => void, (arg: T, err?: any) => void];
export interface Handler<T> {
    /** ## On Success */
    onSuccess?: (arg: T) => void;
    /** ## On Fail */
    onFail?: (arg: T, err?: any) => void;
}
export interface Mapper<Out, In = any> {
    (e: In): Out;
}
export interface Operation<E> {
    (e: E): void;
}
export interface StateSelect<E> {
    (state: any): E;
}
export declare type ObjectId = number | string;
/**
 * Helper type. Passes T out again, but boxes it in a way that it cannot
 * "widen" the type by accident if it is a generic that should be inferred
 * from elsewhere.
 *
 * @internal
 */
export declare type NoInfer<T> = [T][T extends any ? 0 : never];
export interface IDevice {
    /** Get the version of Cordova running on the device. */
    cordova: string;
    /** Indicates that Cordova initialize successfully. */
    available: boolean;
    /**
     * The device.model returns the name of the device's model or product. The value is set
     * by the device manufacturer and may be different across versions of the same product.
     */
    model: string;
    /** Get the device's operating system name. */
    platform: string;
    /** Get the device's Universally Unique Identifier (UUID). */
    uuid: string;
    /** Get the operating system version. */
    version: string;
    /** Get the device's manufacturer. */
    manufacturer: string;
    /** Whether the device is running on a simulator. */
    isVirtual: boolean;
    /** Get the device hardware serial number. */
    serial: string;
}
//# sourceMappingURL=types.d.ts.map
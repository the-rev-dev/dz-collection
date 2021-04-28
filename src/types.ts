import { RouterState } from "connected-react-router";
import {
    Action,
    EnhancedStore,
    ReducersMapObject,
    SliceCaseReducers,
    CreateSliceOptions,
    Middleware,
    AnyAction,
    Draft,
} from '@reduxjs/toolkit';
import { DataProps } from "../data/abstractData";


/* -------------------------------------------------------------------------- */
/*                           Serializable Interfaces                          */
/* -------------------------------------------------------------------------- */

export interface AnyProps {
    [index: string]: any
}
export type IdObject<T = {}> = T & {
    id: ObjectId;
};
export interface TypedObject<Type extends string = string, Subtypes extends string = string> {
    type: Type;
    subtype: Subtypes;
};

export interface SubTyptedObject<SubType extends string = string> {
    subtype: SubType;
}

export interface ValueObject<Value> {
    value: Value;
}

export type SliceProps<S, R extends SliceCaseReducers<S>, N extends string> =
    CreateSliceOptions<S, R, N>;

export interface Filter<E> {
    (e: E): boolean;
}


/* -------------------------------------------------------------------------- */
/*                            Functional Interfaces                           */
/* -------------------------------------------------------------------------- */


export type Handlers<T> = [(arg: T) => void, (arg: T, err?) => void];

export interface Handler<T> {
    /** ## On Success */
    onSuccess?: (arg: T) => void;
    /** ## On Fail */
    onFail?: (arg: T, err?) => void;
}
export interface Mapper<Out, In = any> {
    (e: In): Out;
}
export interface Operation<E> {
    (e: E): void;
}
export interface StateSelect<E> {
    (state): E
}

export type SelectorOptions<Result = DataProps, Type extends string = string, Subtype extends string = string> = {
    type?: Type;
    subtype?: Subtype;
    role?: string;
    mapper?: Mapper<Result>;
}

export interface DataTypeClass<Result = DataProps> {
    type: string;
    subtype?: string;
    role?: string;
    hydrate(args): Result;
    create(args): Result;
}

export interface DataActionDispatcher {
    (data: DataProps | DataProps[]): {
        payload: DataProps<any, string, string> | DataProps<any, string, string>[];
        type: string;
    }
}

export const dataActionDispatcher: DataActionDispatcher = (data) => {
    return { type: "default_dispatch", payload: data };
}


/* -------------------------------------------------------------------------- */
/*                              Type Combinations                             */
/* -------------------------------------------------------------------------- */

export type ObjectId = number | string;
/**
 * Helper type. Passes T out again, but boxes it in a way that it cannot
 * "widen" the type by accident if it is a generic that should be inferred
 * from elsewhere.
 *
 * @internal
 */
export type NoInfer<T> = [T][T extends any ? 0 : never];

export type Middlewares<S> = ReadonlyArray<Middleware<{}, S>>;


/* -------------------------------------------------------------------------- */
/*                                Redux Actions                               */
/* -------------------------------------------------------------------------- */

export interface Dispatch<A extends Action = AnyAction> {
    <T extends A>(action: T): T
}


/* -------------------------------------------------------------------------- */
/*                        TODO: ORGANIZE THE FOLLOWING                        */
/* -------------------------------------------------------------------------- */

export type SliceReducers<T = any, A extends { payload: any; type: string; } = { payload, type }> =
    {
        [index: string]: <S extends T | Draft<T>>(state: S, action: A) => any
    };

/** 
 * Single Reduce Function
 */
export type SliceCase<State, Payload> = (state: State | Draft<State>, action: {
    payload: Payload | Payload[] | Record<ObjectId, Payload>;
    type: string;
}) => Draft<State> | void;

export type SliceDraft<T> = T | Draft<T>;


export interface IReducerManager<R extends ReducersMapObject<S, any>, S = any> {
    getReducerMap: () => R;
    getReducerKeys: () => string[];
    reduce: (state: any, action: Action) => S;
    add: (key: string, reducer: any) => void;
    remove: (key: keyof R) => void;
    initialState: S;
}

export interface DzStore<S, A extends Action = Action, M extends Middlewares<DzState<S>> = Middlewares<DzState<S>>> extends EnhancedStore<DzState<S>, A, M> {
    // addSlice: (slice: RiseSlice<any, any, any>) => any;
    getAppState: () => S,
    getRiseState?: () => DzState<S>
    reducerManager: IReducerManager<ReducersMapObject<DzState<S>, A>, any>,
    runSagas: () => void;
}

export interface DzState<S> {
    childApp: S;
    router: RouterState<any>,
}

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

import {CaseReducer, createAsyncThunk, createSlice, Draft, PayloadAction, SerializedError} from "@reduxjs/toolkit";
import {convertSnakeToCamel} from "../../helpers/helperToCamelCase.ts";
import {Api} from "../../server/api.ts";

export interface BaseState<T> {
    error: string | null;

    [key: string]: T | string | null;
}

export function getSlice<T>(
    name: string,
    itemName: string,
    initialState: BaseState<T>,
    routeName: string
) {
    const load = createAsyncThunk<T, number>(
        `${name}/load`,
        async (id: number) => await new Api().get<T>(`/${routeName}/${id}/`)
    );

    type FulfilledAction = PayloadAction<
        T,
        string,
        {
            arg: number;
            requestId: string;
            requestStatus: "fulfilled";
        },
        never
    >;

    const fulfilledReducer: CaseReducer<BaseState<T>, FulfilledAction> = (state, action) => {
        state[itemName] = convertSnakeToCamel(action.payload) as Draft<T>;
        state.error = null;
    };

    type RejectedAction = PayloadAction<
        unknown,
        string,
        {
            arg: number;
            requestId: string;
            requestStatus: "rejected";
            aborted: boolean;
            condition: boolean;
        } & ({ rejectedWithValue: true } | { rejectedWithValue: false }),
        SerializedError
    >;

    const rejectedReducer: CaseReducer<BaseState<T>, RejectedAction> = (state, action) => {
        state.error = action.error?.message || "Unknown error";
    };

    const slice = createSlice({
        name,
        initialState,
        reducers: {
            clearError: (state) => {
                state.error = null;
            },
            clearItem: (state) => {
                state[itemName] = null;
            }
        },
        extraReducers: (builder) => {
            builder
                .addCase(load.fulfilled, fulfilledReducer)
                .addCase(load.rejected, rejectedReducer)
        },
    });

    const {clearError, clearItem} = slice.actions;

    const selectItem = (state: Record<string, BaseState<T>>) => state[name][itemName] as T;
    const selectError = (state: Record<string, BaseState<T>>) => state[name].error;

    return {
        slice,
        load,
        clearError,
        selectItem,
        clearItem,
        selectError,
    };
}

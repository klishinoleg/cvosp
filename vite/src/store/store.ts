import type {Action, ThunkAction} from '@reduxjs/toolkit'
import {configureStore} from '@reduxjs/toolkit'
import user from "./slices/user"
import project from "./slices/project"
import logger from "redux-logger"
import {DEBUG} from "../constanst/vars.ts";

export const store = configureStore({
        reducer: {
            user, project
        },
        middleware: (getDefaultMiddleware) => {
            const base = getDefaultMiddleware();
            return DEBUG ? base.concat(logger) : base;
        }
    }
)

export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
export type AppThunk<ThunkReturnType = void> = ThunkAction<
    ThunkReturnType,
    RootState,
    unknown,
    Action
>
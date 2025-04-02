import {UserSchema} from "../../schemas/user/User.ts";
import {BaseState, getSlice} from "./baseSlice.ts";


export interface UserState extends BaseState<UserSchema> {
    error: string | null,
    user: UserSchema | null
}

const initialState: UserState = {
    error: null,
    user: null as UserSchema | null,
}

export const {
    slice: userSlice,
    load: loadUser,
    clearError: clearUserError,
    selectItem: selectUser,
    selectError: selectUserError
} = getSlice<UserSchema>(
    "user", "user", initialState, "users"
)

export default userSlice.reducer;

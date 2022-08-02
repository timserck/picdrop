import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface themeState {
    name: "dark" | "light"
}

export const initialState: themeState = {name :  "dark"}


export const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setTheme(state, action: PayloadAction<any>) {
            state.name = action.payload
        }
    }
})

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;

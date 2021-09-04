import { createSlice } from "@reduxjs/toolkit";
import { Themes } from "../../theme";

interface UserState {
  theme: Themes;
}

// Define the initial state using that type
const initialState: UserState = {
  theme: window.matchMedia("(prefers-color-scheme: dark)").matches
    ? Themes.Dark
    : Themes.Light,
};

/**
 * User preferences
 */
export const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {},
});

export default userReducer.reducer;

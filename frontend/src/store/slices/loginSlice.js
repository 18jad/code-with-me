import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loggedIn: false,
  user: null,
  token: "",
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.loggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
});

export const { setLogin } = loginSlice.actions;

export default loginSlice.reducer;

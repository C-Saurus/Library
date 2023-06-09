import { createSlice } from "@reduxjs/toolkit";
import { login, logout, registerUser } from "./authThunk";
import { removeLocalStorage, setLocalStorage } from "../../utils/localStore";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    status: "idle",
  },
  reducer: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "Loading...";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "Successful";
        if (action.payload.statusCode === 200) {
          setLocalStorage("token", action.payload.data.token);
          setLocalStorage("user_id", action.payload.data.id);
          setLocalStorage("role", action.payload.data.role);
          setLocalStorage("username", action.payload.data.username);
        }
      })
      .addCase(login.rejected, (state) => {
        state.status = "Falsed";
      })
      .addCase(logout.pending, (state) => {
        state.status = "Loading...";
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = "Successful";
        removeLocalStorage("token");
        removeLocalStorage("user_id");
        removeLocalStorage("role");
        removeLocalStorage("username");
      })
      .addCase(logout.rejected, (state) => {
        state.status = "Falsed";
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "Loading...";
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "Successful";
      })
      .addCase(registerUser.rejected, (state) => {
        state.status = "Falsed";
      });
  },
});

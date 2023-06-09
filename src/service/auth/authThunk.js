import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../../utils/apiUrl";

export const login = createAsyncThunk("auth/loginStatus", async (user) => {
  try {
    const response = await axios.post(url + "/auth/authenticate", user);
    return {
      statusCode: response.status,
      data: response.data,
    };
  } catch (error) {
    return { statusCode: error.response.status, msg: error.response.data };
  }
});

export const logout = createAsyncThunk("auth/logoutStatus", async () => {
  try {
    const response = await axios.post(url + "/auth/logout");
    return {
      statusCode: response.status,
      msg: response.data,
    };
  } catch (error) {
    return { statusCode: error.response.status, msg: error.response.data };
  }
});

export const registerUser = createAsyncThunk(
  "auth/registerStatus",
  async (newUser) => {
    try {
      const response = await axios.post(url + "/auth/register", newUser);
      return {
        statusCode: response.status,
        msg: response.data,
      };
    } catch (error) {
      return { statusCode: error.response.status, msg: error.response.data };
    }
  }
);

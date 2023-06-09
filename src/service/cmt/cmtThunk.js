import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../../utils/apiUrl";

export const getAllByBookIdAndUsername = createAsyncThunk(
  "cmt/get",
  async ({ params, token }) => {
    const response = await axios.get(url + "/cmt/get", {
      params: params,
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const { data } = response;
    return data;
  }
);

export const getAllByBookId = createAsyncThunk(
  "cmt/getAll",
  async ({ params, token }) => {
    const response = await axios.get(url + `/cmt/all`, {
      params: params,
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const { data } = response;
    return data;
  }
);
export const addCmt = createAsyncThunk("cmt/save", async ({ body, token }) => {
  try {
    const response = await axios.post(url + `/cmt/save`, body, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return {
      statusCode: response.status,
      msg: response.data,
    };
  } catch (error) {
    return { statusCode: error.response.status, msg: error.response.data };
  }
});
export const updateCmt = createAsyncThunk(
  "cmt/update",
  async ({ formData, token }) => {
    try {
      const response = await axios.put(url + "/cmt/update", formData, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      return {
        statusCode: response.status,
        msg: response.data,
      };
    } catch (error) {
      return { statusCode: error.response.status, msg: error.response.data };
    }
  }
);

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../../utils/apiUrl";

export const getAll = createAsyncThunk("book/all", async () => {
  const response = await axios.get(url + "/book/all");
  const { data } = response;
  return data;
});
export const getById = createAsyncThunk("book/get", async ({ id, token }) => {
  const response = await axios.get(url + `/book/${id}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const { data } = response;
  return data;
});
export const addBook = createAsyncThunk(
  "book/save",
  async ({ formData, token }) => {
    try {
      const response = await axios.post(url + `/book/save`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
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
export const updateBook = createAsyncThunk(
  "book/update",
  async ({ formData, token, id }) => {
    try {
      const response = await axios.put(url + `/book/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
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

export const deleteBook = createAsyncThunk(
  "book/delete",
  async ({ id, token }) => {
    try {
      const response = await axios.delete(url + `/book/${id}`, {
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

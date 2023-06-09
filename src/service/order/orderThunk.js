import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../../utils/apiUrl";

export const getAllByUserId = createAsyncThunk(
  "order/getAll",
  async ({ id, token }) => {
    const response = await axios.get(url + `/order/${id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const { data } = response;
    return data;
  }
);
export const addOrder = createAsyncThunk(
  "order/save",
  async ({ body, token }) => {
    try {
      const response = await axios.post(url + `/order/save`, body, {
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
export const updateOrder = createAsyncThunk(
  "order/update",
  async ({ formData, token }) => {
    try {
      const response = await axios.put(url + "/order/update", formData, {
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

export const deleteOrder = createAsyncThunk(
  "order/delete",
  async ({ params, token }) => {
    try {
      const response = await axios.delete(url + `/order/delete`, {
        params: params,
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

export const findOrder = createAsyncThunk(
  "order/find",
  async ({ params, token }) => {
    try {
      const response = await axios.get(url + `/order/find`, {
        params: params,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      return response.data;
    } catch (error) {
      return { statusCode: error.response.status, msg: error.response.data };
    }
  }
);

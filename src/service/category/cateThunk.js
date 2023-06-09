import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../../utils/apiUrl";

export const getAll = createAsyncThunk("cate/all", async (token) => {
  const response = await axios.get(url + "/cate/all", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const { data } = response;
  return data;
});

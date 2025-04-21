import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../services/AxiosInstance.js";

export const getSales = createAsyncThunk("getSales", async ({  page = 1, limit = 6 }) => {
  const response = await axiosInstance.get(`/sales/?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  return { sales: response.data.sales,totalPages: response.data.totalPages, };
});

export const createSale = createAsyncThunk(
  "createSale",
  async ({ newSale }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/sales/`, newSale, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return { createSale: response.data.createSale };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateSale = createAsyncThunk(
  "updateSale",
  async ({ id, editSale }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/sales/${id}`, editSale, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return { editedSale: response.data.editedSale, id };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteSale = createAsyncThunk(
  "deleteSale",
  async ({ saleId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/sales/${saleId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return { saleId, isDelete: !isDelete };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const saleSlice = createSlice({
  name: "sale",
  initialState: { sales: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSales.pending, (state) => {
        state.loading = true;

      })
      .addCase(getSales.fulfilled, (state, action) => {
        state.loading = false;
        state.sales = action.payload.sales;
        
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default saleSlice.reducer;

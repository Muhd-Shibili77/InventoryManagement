import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../services/AxiosInstance.js";

export const addCustomers = createAsyncThunk(
  "addCustomers",
  async ({ newCustomer }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/customer`, newCustomer, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return { newCustomer: response.data.createCustomer };
    } catch (error) {
      return rejectWithValue(error.response.data); 
    }
  }
);

export const getCustomers = createAsyncThunk("getCustomers", async ({ search = "", page = 1, limit = 6 }) => {
  const response = await axiosInstance.get(`/customer/?search=${search}&page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  return { customers: response.data.customers,currentPage: response.data.currentPage,totalPages: response.data.totalPages, };
});

export const deleteCustomers = createAsyncThunk(
  "deleteCustomers",
  async ({ customerId, isDelete }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/customer/${customerId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        data: { isDelete: !isDelete },
      });
      return { customerId, isDelete: !isDelete };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateCustomer = createAsyncThunk(
  "updateCustomer",
  async ({ id, editCustomer }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/customer/${id}`, editCustomer, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return { editedCustomer: response.data.editedCustomer, id };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const customerSlice = createSlice({
  name: "customer",
  initialState: { customers: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.customers;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCustomers.fulfilled, (state, action) => {
        state.loading = false;
        
      });
  },
});

export default customerSlice.reducer;

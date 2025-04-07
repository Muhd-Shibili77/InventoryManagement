import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../services/AxiosInstance.js";

export const addCustomers = createAsyncThunk(
  "addCustomers",
  async ({ newCustomer }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/customer/add`, newCustomer, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return { newCustomer: response.data.createCustomer };
    } catch (error) {
      return rejectWithValue(error.response.data); 
    }
  }
);

export const getCustomers = createAsyncThunk("getCustomers", async () => {
  const response = await axiosInstance.get(`/customer/`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  return { customers: response.data.customers };
});

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
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers.push(action.payload.newCustomer);
      });
  },
});

export default customerSlice.reducer;

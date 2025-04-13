import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../services/AxiosInstance";

export const getStocks = createAsyncThunk(
    'getStock',
    async ()=>{
        const response = await axiosInstance.get('/stock/',{
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        return { stocks: response.data.stocks };
    }
)

const stockSlice = createSlice({
    name: "stock",
    initialState: { stocks: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(getStocks.pending, (state) => {
          state.loading = true;
        })
        .addCase(getStocks.fulfilled, (state, action) => {
          state.loading = false;
          state.stocks = action.payload.stocks;
        })
        .addCase(getStocks.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
    },
  });
  
  export default stockSlice.reducer;
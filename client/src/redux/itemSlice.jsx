import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../services/AxiosInstance.js";

export const getItems = createAsyncThunk(
  "getItems",
  async ({ search = "", page = 1, limit = 6 }) => {
    const response = await axiosInstance.get(
      `/item/?search=${search}&page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    return {
      items: response.data.items,
      currentPage: response.data.currentPage,
      totalPages: response.data.totalPages,
    };
  }
);

export const addItems = createAsyncThunk(
  "addItems",
  async ({ newItem }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/item/`, newItem, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return { newItem: response.data.createdItem };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateItem = createAsyncThunk(
  "updateItem",
  async ({ id, editItem }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/item/${id}`, editItem, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return { editedItem: response.data.editedItem, id };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteItems = createAsyncThunk(
  "deleteItems",
  async ({ itemId, isDelete }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/item/${itemId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        data: { isDelete: !isDelete },
      });
      return { itemId, isDelete: !isDelete };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addStock = createAsyncThunk(
  "addStock",
  async ({ stockItem }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/stock/`, stockItem, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const itemSlice = createSlice({
  name: "item",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(getItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addItems.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map((item) =>
          item._id === action.payload.itemId
            ? { ...item, isDelete: action.payload.isDelete }
            : item
        );
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map((item) =>
          item._id === action.payload.id
            ? { ...item, ...action.payload.editedItem }
            : item
        );
      });
  },
});

export default itemSlice.reducer;

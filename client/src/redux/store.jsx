import { configureStore } from "@reduxjs/toolkit";
import customerReducer from './customerSlice.jsx'
import itemReducer from './itemSlice.jsx'
import saleReducer from './saleSlice.jsx'
const store = configureStore({
    reducer:{
        customer:customerReducer,
        item:itemReducer,
        sale:saleReducer,
    }
})

export default store;
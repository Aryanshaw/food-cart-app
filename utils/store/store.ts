import { configureStore } from "@reduxjs/toolkit";
// import counterReducer from "../slices/CounterSlice";
import productReducer from "../slices/ProductSlice";

const store = configureStore({
  reducer: {
    // counter: counterReducer,
    productDetails: productReducer
  },
});

export default store;

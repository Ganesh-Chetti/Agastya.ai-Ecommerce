import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./redux"; // ✅ Ensure correct import
import App from "./App";

const store = configureStore({
  reducer: {
    cart: cartReducer, // ✅ Ensure `cart` key matches selector in redux.jsx
  },
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

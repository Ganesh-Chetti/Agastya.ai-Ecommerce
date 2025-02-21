import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./redux"; // ✅ Ensure correct import

export const store = configureStore({
  reducer: {
    cart: cartReducer, // ✅ Correct reducer name
  },
});

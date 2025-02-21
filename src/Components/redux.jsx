import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

const initialState = { items: [] }; // ✅ No need for totalAmount here

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const itemIndex = state.items.findIndex((i) => i.id === action.payload.id);
      if (itemIndex !== -1) {
        state.items[itemIndex].quantity += 1; // ✅ Increment quantity
      } else {
        state.items.push({ ...action.payload, quantity: 1 }); // ✅ Add new item with quantity 1
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity } = cartSlice.actions;

// ✅ Ensure cart state is always an array
const selectCartState = (state) => state.cart || { items: [] };

export const memoizedCartItemsSelector = createSelector(
  [selectCartState],
  (cart) => cart.items || []
);

export default cartSlice.reducer;

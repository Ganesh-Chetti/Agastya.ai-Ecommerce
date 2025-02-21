import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, memoizedCartItemsSelector } from "./redux";
import "../Styles/Cart.css";

const Cart = () => {
  const cartItems = useSelector(memoizedCartItemsSelector);
  const dispatch = useDispatch();
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const showCustomAlert = (message, type = "info") => {
    setAlertMessage(message);
    setAlertType(type);
    
    setTimeout(() => {
      setAlertMessage("");
    }, 2000);
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
    showCustomAlert("Item removed from cart", "warning");
  };

  const handleQuantityChange = (id, newQuantity, stock) => {
    if (newQuantity <= 0) {
      showCustomAlert("Quantity must be at least 1", "error");
      return;
    }

    if (newQuantity > stock) {
      showCustomAlert(`⚠️ Only ${stock} items available!`, "error");
      return;
    }

    dispatch(updateQuantity({ id, quantity: newQuantity }));
    showCustomAlert("Cart updated successfully", "success");
  };

  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>

      {alertMessage && <div className={`custom-alert ${alertType}`}>{alertMessage}</div>}

      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-info">
                <img src={item.imageURL} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p>Rs. {item.price}</p>
                  <p className="stock-info">Stock: {item.stock}</p>
                </div>
              </div>
              <div className="cart-item-actions">
                <div className="quantity-controls">
                  <button 
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.stock)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <input type="text" value={item.quantity} readOnly />
                  <button 
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.stock)}
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </button>
                </div>
                <button className="delete-btn" onClick={() => handleRemove(item.id)}>Delete</button>
              </div>
            </div>
          ))}
          <hr />
          <h3 className="total-amount">Total Amount: Rs. {totalAmount}</h3>
          <button className="checkout-btn">Proceed to Checkout</button>
        </>
      )}
    </div>
  );
};

export default Cart;

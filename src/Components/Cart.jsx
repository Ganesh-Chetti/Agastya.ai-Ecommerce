import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, memoizedCartItemsSelector, addToCart } from "./redux";
import "../Styles/Cart.css";

const Cart = () => {
  const cartItems = useSelector(memoizedCartItemsSelector);
  const dispatch = useDispatch();
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://geektrust.s3.ap-southeast-1.amazonaws.com/coding-problems/shopping-cart/catalogue.json")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

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

  const handleQuantityChange = (id, newQuantity) => {
    const product = products.find((p) => p.id === id);
    const availableStock = product ? product.quantity : 0;

    if (newQuantity < 1) {
      showCustomAlert("⚠️ Quantity must be at least 1!", "error");
      return;
    }

    if (newQuantity > availableStock) {
      showCustomAlert(`⚠️ Only ${availableStock} items available!`, "error");
      return;
    }

    dispatch(updateQuantity({ id, quantity: newQuantity }));
    showCustomAlert("✅ Cart updated successfully", "success");
  };

  const handleAddToCart = (product) => {
    const cartItem = cartItems.find((item) => item.id === product.id);
    const totalQuantityInCart = cartItem ? cartItem.quantity + 1 : 1;

    console.log(
      `Adding Product: ${product.name}, Cart Quantity: ${totalQuantityInCart}, Available Stock: ${product.quantity}`
    );

    if (totalQuantityInCart > product.quantity) {
      showCustomAlert(`⚠️ Only ${product.quantity} ${product.name}(s) available!`, "error");
    } else {
      dispatch(addToCart(product));
      showCustomAlert(`✅ ${product.name} added to cart!`, "success");
    }
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
          {cartItems.map((item) => {
            const product = products.find((p) => p.id === item.id);
            const availableStock = product ? product.quantity : 0;

            return (
              <div key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <img src={item.imageURL} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <p>Rs. {item.price}</p>
                    <p className="stock-info">Available: {availableStock}</p>
                    {item.quantity > availableStock && (
                      <p className="error-msg">Only {availableStock} items available</p>
                    )}
                  </div>
                </div>
                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <input type="text" value={item.quantity} readOnly />
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      disabled={item.quantity >= availableStock}
                    >
                      +
                    </button>
                  </div>
                  <button className="delete-btn" onClick={() => handleRemove(item.id)}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
          <hr />
          <h3 className="total-amount">Total Amount: Rs. {totalAmount}</h3>
          <button className="checkout-btn" onClick={()=>{showCustomAlert(`Your order is successfully ✅done`, "success");}}>Proceed to Checkout</button>
        </>
      )}
    </div>
  );
};

export default Cart;

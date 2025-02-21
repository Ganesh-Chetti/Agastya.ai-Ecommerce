import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaShoppingCart } from "react-icons/fa";
import "../Styles/Navbar.css";

const Navbar = () => {
  const cartItems = useSelector((state) => state.cart?.items || []);

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">TeeRex Store</Link>
      </div>

      {/* Navigation Links */}
      <div className="nav-links">
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/cart" className="nav-item cart-container">
          <FaShoppingCart />
          {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

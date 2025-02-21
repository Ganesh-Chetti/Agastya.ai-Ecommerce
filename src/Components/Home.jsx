import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, memoizedCartItemsSelector } from "./redux";
import { FaFilter } from "react-icons/fa";
import Sidebar from "./sidebar"; // Import Sidebar component
import "../Styles/Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({ color: [], gender: [], price: [], type: [] });
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 850);

  const dispatch = useDispatch();
  const cartItems = useSelector(memoizedCartItemsSelector);

  useEffect(() => {
    fetch("https://geektrust.s3.ap-southeast-1.amazonaws.com/coding-problems/shopping-cart/catalogue.json")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 850);
      if (window.innerWidth >= 850) setShowSidebar(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleFilterChange = (category, value) => {
    setFilters((prev) => {
      const updated = {
        ...prev,
        [category]: prev[category].includes(value)
          ? prev[category].filter((item) => item !== value)
          : [...prev[category], value],
      };
      return { ...updated };
    });
  };

  useEffect(() => {
    let filtered = products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );

    Object.keys(filters).forEach((key) => {
      if (filters[key].length > 0) {
        filtered = filtered.filter((product) => {
          if (key === "price") {
            return filters[key].some((priceRange) => {
              const [min, max] = priceRange.split("-").map(Number);
              return product.price >= min && (max ? product.price <= max : true);
            });
          }
          return filters[key].includes(product[key]);
        });
      }
    });
    setFilteredProducts(filtered);
  }, [search, filters, products]);

  const showCustomAlert = (message, type = "success") => {
    const alertBox = document.createElement("div");
    alertBox.className = `custom-alert ${type}`;
    alertBox.innerText = message;
    document.body.appendChild(alertBox);
  
    setTimeout(() => {
      alertBox.style.opacity = "0";
      setTimeout(() => alertBox.remove(), 500);
    }, 2000);
  };
  
  const handleAddToCart = (product) => {
    const cartItem = cartItems.find((item) => item.id === product.id);
  
    if (cartItem && cartItem.quantity >= product.quantity) {
      showCustomAlert(`⚠️ Only ${product.quantity} ${product.name}(s) available!`, "error");
    } else {
      dispatch(addToCart(product));
      showCustomAlert(`${product.name} added to cart!`, "success");
    }
  };

  return (
    <div className="home-container">
      
      <div className="cart">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-bar"
          />
          {isMobile && <FaFilter className="filter-icon" onClick={() => setShowSidebar(!showSidebar)} />}
        </div>
      <Sidebar
        filters={filters}
        handleFilterChange={handleFilterChange}
        showSidebar={showSidebar}
        isMobile={isMobile}
      />
          </div>
        
        <div className="product-list">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.imageURL} alt={product.name} onError={(e) => (e.target.src = "fallback.jpg")} />
              <h3>{product.name}</h3>
              <p>Rs. {product.price}</p>
              <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;

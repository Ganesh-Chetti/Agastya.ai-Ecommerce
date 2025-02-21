import React from "react";
import "../Styles/Home.css";

const Sidebar = ({ filters, handleFilterChange, showSidebar, isMobile }) => {
  return (
    (showSidebar || !isMobile) && (
      <div className={`sidebar ${showSidebar || !isMobile ? "show" : "hide"}`}>
        <h3>Filters</h3>
        <div className="filter-group">
          <h4>Colour</h4>
          {["Red", "Blue", "Green"].map((color) => (
            <label key={color}>
              <input
                type="checkbox"
                onChange={() => handleFilterChange("color", color)}
              />{" "}
              {color}
            </label>
          ))}
        </div>
        <div className="filter-group">
          <h4>Gender</h4>
          {["Men", "Women"].map((gender) => (
            <label key={gender}>
              <input
                type="checkbox"
                onChange={() => handleFilterChange("gender", gender)}
              />{" "}
              {gender}
            </label>
          ))}
        </div>
        <div className="filter-group">
          <h4>Price</h4>
          {["0-250", "251-450", "450-500"].map((price) => (
            <label key={price}>
              <input
                type="checkbox"
                onChange={() => handleFilterChange("price", price)}
              />{" "}
              {price}
            </label>
          ))}
        </div>
        <div className="filter-group">
          <h4>Type</h4>
          {["Polo", "Hoodie", "Basic"].map((type) => (
            <label key={type}>
              <input
                type="checkbox"
                onChange={() => handleFilterChange("type", type)}
              />{" "}
              {type}
            </label>
          ))}
        </div>
      </div>
    )
  );
};

export default Sidebar;

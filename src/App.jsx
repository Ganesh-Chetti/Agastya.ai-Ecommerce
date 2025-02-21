import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./Components/store";
import Home from "./Components/Home";
import Cart from "./Components/Cart";
import Navbar from "./Components/Navbar";
// import "./styles/global.css";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </Router>
    </Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);



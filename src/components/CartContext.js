import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const CartContext = createContext();

export const CartProvider = ({ children, user }) => {
  const [cartItems, setCartItems] = useState([]);

  const fetchCartItems = useCallback(() => {
    if (user) {
      axios
        .get(`http://localhost:5000/api/users/${user._id}/cart`)
        .then((response) => {
          setCartItems(response.data.cart);
        })
        .catch((error) => {
          console.error("There was an error fetching the cart items!", error);
        });
    }
  }, [user]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  return (
    <CartContext.Provider value={{ cartItems, fetchCartItems }}>
      {children}
    </CartContext.Provider>
  );
};

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

// Create context
const ContextApi = createContext();

// Context provider component
export const ContextProvider = ({ children }) => {
  // Get token and user info from localStorage
  const getToken = localStorage.getItem("JWT_TOKEN") || null;
  const isADmin = localStorage.getItem("IS_ADMIN") === "true";

  // State for token, current user, sidebar state, and admin status
  const [token, setToken] = useState(getToken);
  const [currentUser, setCurrentUser] = useState(null);
  const [openSidebar, setOpenSidebar] = useState(true);
  const [isAdmin, setIsAdmin] = useState(isADmin);
  const [password, setPassword] = useState(""); // Store password

  // Fetch the user data and check if user is admin
  const fetchUser = async () => {
    const user = localStorage.getItem("USER")
      ? JSON.parse(localStorage.getItem("USER"))
      : null;

    if (user?.username) {
      try {
        const { data } = await api.get(`/auth/user`);
        const roles = data.roles;

        if (roles.includes("ROLE_ADMIN")) {
          localStorage.setItem("IS_ADMIN", "true");
          setIsAdmin(true);
        } else {
          localStorage.removeItem("IS_ADMIN");
          setIsAdmin(false);
        }

        setCurrentUser(data);
        setPassword(user.password); // Store password in context
      } catch (error) {
        console.error("Error fetching current user", error);
        toast.error("Error fetching current user");
      }
    }
  };

  // If token exists, fetch the current user
  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  // Function to log out the user
  const logout = () => {
    localStorage.removeItem("JWT_TOKEN");
    localStorage.removeItem("USER");
    localStorage.removeItem("IS_ADMIN");
    setToken(null);
    setCurrentUser(null);
    setIsAdmin(false);
    toast.success("Logged out successfully");
  };

  // Provide context to children components
  return (
    <ContextApi.Provider
      value={{
        token,
        setToken,
        currentUser,
        setCurrentUser,
        openSidebar,
        setOpenSidebar,
        isAdmin,
        setIsAdmin,
        password, // Include password in the context
        setPassword, // Allow updating password in context
        logout, // Provide logout function
      }}
    >
      {children}
    </ContextApi.Provider>
  );
};

// Custom hook to access context
export const useMyContext = () => {
  return useContext(ContextApi);
};

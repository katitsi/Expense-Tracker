import React, { createContext, useState } from "react";
import { useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    if (!localStorage.getItem("token")) {
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.get(API_PATHS.USER.GET_INFO);
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) return;
    loadUser();
  }, []);

  const updateUser = (userData) => {
    setUser({ ...user, ...userData });
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, updateUser, clearUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

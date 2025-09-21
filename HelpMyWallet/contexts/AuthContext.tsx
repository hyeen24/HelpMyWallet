import axios from "axios";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';

import { Alert } from "react-native";
import api from "@/app/api";
import { UserType } from "@/types";

export const AuthContext = createContext<{
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (first_name: string, username: string, password: string) => Promise<boolean>;
  isLoading: boolean;
  userToken: string | null;
  refreshToken: () => Promise<boolean>;
  user: UserType | null;
}>({
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  isLoading: false,
  userToken: null,
  refreshToken: async () => false,
  user: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);

  // Load token and user from SecureStore on app start
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const token = await SecureStore.getItemAsync("accessToken");
        const storedUser = await SecureStore.getItemAsync("user");

        if (token) setUserToken(token);
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (e) {
        console.log("Error loading auth data:", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const fetchUserInfo = async (): Promise<UserType | null> => {
    try {
      const res = await api.get("/api/me"); // your user info endpoint
      const userData: UserType = res.data;
      setUser(userData);
      await SecureStore.setItemAsync("user", JSON.stringify(userData));
      return userData;
    } catch (err) {
      console.error("Failed to fetch user info:", err);
      return null;
    }
  };

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post("/api/token/", { username, password });
      const { access, refresh } = response.data;

      await SecureStore.setItemAsync("accessToken", access);
      await SecureStore.setItemAsync("refreshToken", refresh);
      setUserToken(access);

      await fetchUserInfo(); // fetch and store user info
      return true;
    } catch (err) {
      console.error("Login error:", err);
      Alert.alert("Invalid email or password.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (first_name: string, username: string, password: string) => {
    setIsLoading(true);
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync("user");
    setUserToken(null);
    setUser(null);

    try {
      const response = await api.post("/api/user/register/", { first_name, username, password });
      console.log("Register response:", response);
      return true;
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData?.username) {
        Alert.alert("Registration Error", errorData.username[0]);
      } else {
        Alert.alert("Registration Error", "An unknown error occurred");
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refresh = await SecureStore.getItemAsync("refreshToken");
      if (!refresh) return false;

      const response = await api.post("/api/token/refresh/", { refresh });
      const newAccess = response.data.access;

      await SecureStore.setItemAsync("accessToken", newAccess);
      setUserToken(newAccess);

      // Optionally, refresh user info as well
      await fetchUserInfo();

      return true;
    } catch (err) {
      return false;
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync("user");
    setUserToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ login, logout, register, isLoading, userToken, refreshToken, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};

  
import axios from "axios";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';

import { Alert } from "react-native";
import api from "@/app/api";

export const AuthContext = createContext<{
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (first_name: string, username: string, password: string) => Promise<boolean>;
  isLoading: boolean;
  userToken: string | null;
  refreshToken: () => Promise<boolean>;
}>({
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  isLoading: false,
  userToken: null,
  refreshToken: async () => false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState<string | null>(null);
  
    useEffect(() => {
        const loadToken = async () => {
          try {
            const token = await SecureStore.getItemAsync("accessToken");
            if (token) {
              setUserToken(token);
            }
          } catch (e) {
            console.log("Token load error:", e);
          } finally {
            setIsLoading(false); // ✅ Make sure this always runs
          }
        };
      
        loadToken();
      }, []);
  
    const login = async (username: string, password: string) => {
    // console.log("AuthContext(login) :, username:",username)
      setIsLoading(true);
      
      try {
        const response = await api.post("/api/token/", { username, password });
        console.log("res: ",response);
  
        const { access, refresh } = response.data;
        await SecureStore.setItemAsync("accessToken", access);
        await SecureStore.setItemAsync("refreshToken", refresh);
        setUserToken(access);

        api.get('/api/me').then(async (res)=>{
            const {first_name, user_name} = res.data
            await SecureStore.setItemAsync("name", first_name);
        })
        
        // console.log(access)
        return true;
      } catch (err) {
        console.error("Login error:", err);
        Alert.alert("Invalid email or password.")
        return false;
      } finally {
        setIsLoading(false);
      }
    };

    const register = async (first_name: string, username:string, password:string) => {
        setIsLoading(true);
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
        await SecureStore.deleteItemAsync("name");
        
        try {
            const response = await api.post("/api/user/register/", {first_name, username, password });
            console.log(response)

            return true;

        } catch (err) {
          const errorData = await err.response.data;
          
          if (errorData.username) {
            Alert.alert("Registration Error", errorData.username[0]) // Username already exists
            return false
           } else {
            Alert.alert("Registration Error", "An unknown error has occured") // Username already exists
            return false
           }
           
        } finally {
            setIsLoading(false);
        }
    };
  
    const refreshToken = async (): Promise<boolean> => {
      
      try {
        const refresh = await SecureStore.getItemAsync("refreshToken");
        console.log("Trying to refresh token with:", refresh);
        if (!refresh) return false;
  
        const response = await api.post("/api/token/refresh/", { refresh });
        const newAccess = response.data.access;
  
        await SecureStore.setItemAsync("accessToken", newAccess);
        setUserToken(newAccess);
        return true;
      } catch (err) {
        // console.log("Token refresh failed:", err.response?.data || err.message);
        return false;
      }
    };
  
    const logout = async () => {
        // console.log("logout")
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      await SecureStore.deleteItemAsync("name");
      setUserToken(null);
      
    };

    return (
      <AuthContext.Provider value={{ login, logout, register, isLoading, userToken, refreshToken }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
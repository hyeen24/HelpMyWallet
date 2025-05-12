import axios from "axios";
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from "jwt-decode";

const API_URL = Constants.expoConfig?.extra?.apiUrl;

const api = axios.create({
  baseURL: API_URL,
});

console.log("API URL:", API_URL);

// Request interceptor with token expiration handling
api.interceptors.request.use(
  async (config) => {
    let token = await SecureStore.getItemAsync("accessToken");

    if (token) {
      const decoded: any = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);

      if (decoded.exp < now) {
        // Token expired — try to refresh
        const refresh = await SecureStore.getItemAsync("refreshToken");
        if (refresh) {
          try {
            const response = await axios.post(`${API_URL}/api/token/refresh/`, {
              refresh,
            });

            const newAccess = response.data.access;
            await SecureStore.setItemAsync("accessToken", newAccess);
            token = newAccess; // update token
          } catch (err) {
            console.error("❌ Failed to refresh token:", err);
            // Optional: clear tokens if refresh fails
            await SecureStore.deleteItemAsync("accessToken");
            await SecureStore.deleteItemAsync("refreshToken");
            throw err;
          }
        }
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.log("❌ Axios config error:", error);
    return Promise.reject(error);
  }
);

export default api;

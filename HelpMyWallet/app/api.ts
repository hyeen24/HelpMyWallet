import axios from "axios";
import { ACCESS_TOKEN } from "@/constants/constants";
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const API_URL = Constants.expoConfig?.extra?.apiUrl;

const api = axios.create({
    baseURL: API_URL
})

console.log("API URL :",API_URL)
api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync(ACCESS_TOKEN);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        console.log("In Error: api.ts")
        return Promise.reject(error)
    }
)

export default api
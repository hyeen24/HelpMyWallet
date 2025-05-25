import axios from "axios";
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const API_URL = Constants.expoConfig?.extra?.apiUrl;

const api = axios.create({
    baseURL: API_URL
})

console.log("API URL :",API_URL)
api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync("accessToken");
        console.log("Token: ", token)

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
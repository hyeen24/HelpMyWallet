import axios from "axios";
import { ACCESS_TOKEN } from "@/constants/constants";
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl;

const api = axios.create({
    baseURL: API_URL
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default api
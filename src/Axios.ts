import axios, { AxiosInstance } from "axios";

const axiosInstance : AxiosInstance = axios.create({
    baseURL : import.meta.env.VITE_BASE_URL,
    headers : {
        "Content-Type" : "application/json"
    }
})

export default axiosInstance
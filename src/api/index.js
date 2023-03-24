import ax from "axios";
import baseUrl from "../utils/baseUrl";

const axios = ax.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json'
    }
})

axios.interceptors.response.use((response) => {

    return response.data;
}, (error) => {

    return Promise.reject(error);
});

export default axios;
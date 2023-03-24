import ax from "axios";
import baseUrl from "../utils/baseUrl";
import store from "../store";

const axios = ax.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json'
    }
})

axios.interceptors.response.use((response) => {

    return response.data;
}, (error) => {
    alert(`Error: ${error?.response?.data?.message || 'Error'}`)
    console.log(error)
    if (error?.response?.data?.status === 401) {
        store.commit('resetStore')
    }

    return Promise.reject(error);
});

export default axios;
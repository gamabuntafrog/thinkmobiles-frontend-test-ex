import ax from "axios";

const axios = ax.create({
    baseURL: 'http://localhost:3001/',
    headers: {
        'Content-Type': 'application/json'
    }
})

axios.interceptors.response.use(function (response) {

    return response.data;
}, function (error) {

    return Promise.reject(error);
});

export default axios;
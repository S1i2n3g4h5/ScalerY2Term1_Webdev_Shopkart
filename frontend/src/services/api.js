import axios  from 'axios';

const API = axios.create({
    baseURL : 'http://localhost:5000',   // common prefix for backend endpoints
    withCredentials: true,      //  automically include httponly cookies in requests
})

export default API;
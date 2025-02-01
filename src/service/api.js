import axios from "axios";

const api = axios.create({
    baseURL: 'https://viacep.com.br/ws/25812340/json/'
});

export default api;

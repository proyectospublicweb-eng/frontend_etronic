import axios from "axios";

const defaultApiUrl = import.meta.env.PROD ? "/apietronic" : "http://localhost:3000/apietronic";

const instanceAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultApiUrl,
  withCredentials: true,
});

export default instanceAxios;

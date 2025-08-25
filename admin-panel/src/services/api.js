import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  withCredentials: true, 
});
console.log("👉 API URL from env:", import.meta.env.VITE_API_URL);


export default api;

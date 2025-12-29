// src/utils/axiosConfig.ts
import axios from "axios";

const API_ROOT =
  process.env.NEXT_PUBLIC_API_ROOT ||
  "https://api20251116200831-djh7b7e4dseec6a4.southeastasia-01.azurewebsites.net";

const api = axios.create({
  baseURL: API_ROOT,
  headers: { "Content-Type": "application/json" },
  withCredentials: false, 
});
  
const _get = async (url: string, config = {}) => {
  return api.get(url, config);
}


export default api;
// // src/utils/axiosConfig.ts
// import axios from "axios";

// const API_ROOT =
//   process.env.NEXT_PUBLIC_API_ROOT ||
//   "https://transphysical-charlotte-doomfully.ngrok-free.dev"; // ngrok URL của bạn

// const api = axios.create({
//   baseURL: API_ROOT,
//   headers: { "Content-Type": "application/json" },
//   withCredentials: false, // BE không set cookie => false
// });

// // 🧠 Gắn accessToken (đã lưu ở localStorage)
// api.interceptors.request.use((config) => {
//   const token =
//     typeof window !== "undefined"
//       ? localStorage.getItem("accessToken") // phải trùng key
//       : null;
//   if (token && config.headers) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;

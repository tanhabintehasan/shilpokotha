import axios from 'axios';

// আপনার লাইভ ব্যাকএন্ড ইউআরএল এখানে একবারই সেট করুন
const BASE_URL = "https://shilpokotha-backend-8o4q410ae-tanhabintehasans-projects.vercel.app";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true // যদি কুকি বা সেশন ব্যবহার করেন
});

export default axiosInstance;
import axios from "axios";

export default axios.create({
    baseURL: "https://lasuvlp-2-0.onrender.com/api"
    // baseURL: "http://localhost:8080/api"
})
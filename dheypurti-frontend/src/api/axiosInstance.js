import axios from "axios";

const token = localStorage.getItem("token");

const instance = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json"
  },
});

export default instance;

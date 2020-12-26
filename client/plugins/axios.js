export default function({ $axios, redirect }) {
  $axios.interceptors.request.use(config => {
    let token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });
}

import jwt_decode from "jwt-decode";
export default function({ store, redirect, route }) {
  let token = localStorage.getItem("token");
  if (token) {
  let decoded = jwt_decode(token);
    let isExpiredToken = decoded.exp <= new Date().getTime() / 1000;
    if (!isExpiredToken && (route.path == "/login" || route.path == "/login/") && decoded.role != 5)
      return redirect("/");
  }
}

import jwt_decode from "jwt-decode";
export default function({ store, redirect, route }) {
  let token = localStorage.getItem("token");
  if (token) {
    let isExpiredToken = jwt_decode(token).exp <= new Date().getTime() / 1000;
    if (!isExpiredToken && (route.path == "/login" || route.path == "/login/"))
      return redirect("/");
  }
}

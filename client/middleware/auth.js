import jwt_decode from "jwt-decode";
export default function({ store, redirect }) {
  if (!localStorage.getItem("token")) {
    return redirect("/login");
  }else {
    let token = localStorage.getItem("token");
    try {
      const data = jwt_decode(token);
    } catch(error) {
      localStorage.clear();
      return redirect("/login");
    }
    let isExpiredToken = jwt_decode(token).exp <= new Date().getTime() / 1000;
    if (isExpiredToken) redirect("/login");
  }
}

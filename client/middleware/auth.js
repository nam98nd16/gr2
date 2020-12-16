import jwt_decode from "jwt-decode";
export default function({ store, redirect }) {
  if (!localStorage.getItem("token")) {
    return redirect("/login");
  }
}

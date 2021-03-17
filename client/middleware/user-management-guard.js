import jwt_decode from "jwt-decode";
export default function({ store, redirect }) {
  let decodedUser = jwt_decode(localStorage.getItem("token"));
  if (!(decodedUser?.role == 0)) {
    return redirect("/access-denied");
  }
}

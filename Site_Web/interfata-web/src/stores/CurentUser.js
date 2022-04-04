import { extendObservable } from "mobx";

class CurentUser {
  constructor() {
    extendObservable(this, {
      loading: true,
      isLoggedIn: false,
      username: "",
      password: "",
      email: "",
      admin: 0,
      preference:"/costume",
    });
  }
}

export default new CurentUser();

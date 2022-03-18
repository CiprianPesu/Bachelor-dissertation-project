import { extendObservable } from "mobx";

class CurentUser {
  constructor() {
    extendObservable(this, {
      loading: true,
      isLoggedIn: false,
      username: "",
      password: "",
      admin: 0,
      curentPage:1,
    });
  }
}

export default new CurentUser();

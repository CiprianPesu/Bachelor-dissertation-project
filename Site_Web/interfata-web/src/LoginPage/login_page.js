import React from "react";
import MyButton from "../Utilities/Button";
import MyInput from "../Utilities/MyInput";
import "./LoginPage.css";
import CurentUser from "../stores/CurentUser";
import { observer } from "mobx-react";
class Login_Page extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      email: "",
      page: "login",
      buttonDisable: false,
    };
  }

  setInputValue(proprety, val) {
    val = val.trim();
    if (val.length > 25) {
      return;
    }
    this.setState({
      [proprety]: val,
    });
  }

  reset() {
    this.setState({
      username: "",
      password: "",
      buttonDisable: false,
    });
  }

  async doRegister() {
    if (!this.state.username) {
      return;
    }
    if (!this.state.password) {
      return;
    }
    if (!this.state.email) {
      return;
    }

    this.setState({
      buttonDisable: false,
    });

    try {
      let res = await fetch("/register", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
          email: this.state.email,
        }),
      });

      let result = await res.json();

      if (result && result.success) {
        this.reset();
        this.setState.page = "ToLogin";
        alert(result.msg);
      } else {
        this.reset();
        alert(result.msg);
      }
    } catch (error) {
      console.log(error);
      this.reset();
    }
  }

  async doLogIn() {
    if (!this.state.username) {
      return;
    }
    if (!this.state.password) {
      return;
    }

    this.setState({
      buttonDisable: false,
    });
    
    const name=this.state.username

    try {
      let res = await fetch("/login", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
        }),
      });

      await res.json().then((response) => {
        response=JSON.parse(response);
        if (response.success == true) {
          CurentUser.username = name;
          CurentUser.isLoggedIn = true;
          CurentUser.admin = response.admin;
        }
        else{
          this.reset();
          alert(response.msg);
        }
      });
    } catch (error) {
      console.log(error);
      this.reset();
    }
  }

  goRegister() {
    this.setState({ page: "ToRegister" });
  }

  goLogin() {
    this.setState({ page: "ToLogin" });
  }

  confirmPage() {
    if (this.state.page === "ToLogin") {
      this.setState({ page: "Login", animation_count: 0 });
    } else if (this.state.page === "ToRegister") {
      this.setState({ page: "Register", animation_count: 0 });
    }
  }

  render() {
    return (
      <div className="Container">
        <div
          className="loginForm"
          page={this.state.page}
          onAnimationEnd={() => this.confirmPage()}
        >
          <a className="Text">Autentificare</a>
          <div className="InputDiv">
            <MyInput
              type="text"
              placeholder="Username"
              value={this.state.username}
              onChange={(val) => this.setInputValue("username", val)}
            ></MyInput>
            <MyInput
              type="password"
              placeholder="Password"
              value={this.state.password ? this.state.password : ""}
              onChange={(val) => this.setInputValue("password", val)}
            ></MyInput>
          </div>
          <div className="ButtonsDiv">
            <MyButton
              text="LogIn"
              disabled={this.state.disabled}
              onClick={() => this.doLogIn()}
              color="green"
            ></MyButton>

            <MyButton
              text="Register"
              disabled={this.state.disabled}
              onClick={() => this.goRegister()}
              color="green"
            ></MyButton>
          </div>
        </div>
        <div className="RegisterForm" page={this.state.page}>
          <a className="Text">Inregistrare</a>
          <div className="InputDiv">
            <MyInput
              type="text"
              placeholder="Username"
              value={this.state.username}
              onChange={(val) => this.setInputValue("username", val)}
            ></MyInput>
            <MyInput
              type="password"
              placeholder="Password"
              value={this.state.password ? this.state.password : ""}
              onChange={(val) => this.setInputValue("password", val)}
            ></MyInput>
            <MyInput
              type="text"
              placeholder="Email"
              value={this.state.email}
              onChange={(val) => this.setInputValue("email", val)}
            ></MyInput>
          </div>
          <div className="ButtonsDiv">
            <MyButton
              text="LogIn"
              disabled={this.state.disabled}
              onClick={() => this.goLogin()}
              color="green"
            ></MyButton>

            <MyButton
              text="Register"
              disabled={this.state.disabled}
              onClick={() => this.doRegister()}
              color="green"
            ></MyButton>
          </div>
        </div>
      </div>
    );
  }
}

export default observer(Login_Page);

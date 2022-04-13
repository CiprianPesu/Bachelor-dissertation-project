import React from "react";
import "./LoginPage.css";
import CurentUser from "../../stores/CurentUser";
import { observer } from "mobx-react";

import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material/';
import { Button } from '@mui/material/';
import { Navigate } from 'react-router-dom';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const CostumeField = styled(TextField)(({ theme }) => ({
  margin: " 0 0 10px 0",
  color: '#74aa9d',


  '& .MuiInputBase-input': {
    position: 'relative',
    backgroundColor: 'transparent',
    fontSize: 20,
    width: '600px',
    padding: '5px',
    color: "white",
    borderBottomColor: 'white',
  },

  '& label': {
    color: 'white',
    fontSize: 20,
  },


  '& label.Mui-focused': {
    color: '#000',
    fontSize: 25,
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#FFF',
  },
}));

class Login_Page extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      email: "",
      page: "Login",
      buttonDisable: false,
      redirect: false,

      Alert: {
        open: false,
        severity: "error",
        message: "",
      }
    };

    this.doLogIn = this.doLogIn.bind(this);
  }

  handleChange = (event) => {
    let val = event.target.value;

    val = val.trim();
    if (val.length > 25) {
      return;
    }
    this.setState({
      [event.target.name]: val,
    });

  };


  reset() {
    this.setState({
      username: "",
      password: "",
      email: "",
      buttonDisable: false,
    });
  }

  async doRegister() {
    


    if (!this.state.username) {
      this.setState({ Alert: { open: true, severity: "error", message: "Please enter your username !" } });
      return;
    }
    if (!this.state.password) {
      this.setState({ Alert: { open: true, severity: "error", message: "Please enter your password !" } });
      return;
    }
    if (!this.state.email) {
      this.setState({ Alert: { open: true, severity: "error", message: "Please enter your email !" } });
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
      result = JSON.parse(result);

      if (result && result.success) {
        this.setState({ page: "Login", buttonDisable: false, Alert: { open: true, severity: "success", message: "Register Successfully !" } });
      } else {
        this.setState({ buttonDisable: false, Alert: { open: true, severity: "error", message: result.msg } });
      }
    } catch (error) {
      console.log(error);
      this.setState({ buttonDisable: false });
    }
    this.reset();
  }

  async doLogIn() {

    this.setState({ buttonDisable: true });

    if (!this.state.username) {
      this.setState({ buttonDisable: false, Alert: { open: true, severity: "error", message: "Please enter your username !" } });
      return;
    }
    if (!this.state.password) {
      this.setState({ buttonDisable: false, Alert: { open: true, severity: "error", message: "Please enter your password !" } });
      return;
    }

    const name = this.state.username

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
        response = JSON.parse(response);
        if (response.success == true) {
          CurentUser.username = name;
          CurentUser.isLoggedIn = true;
          CurentUser.admin = response.admin;
          CurentUser.preference = response.preference;
          CurentUser.email = response.email;

          this.setState({ redirect: true })

        }
        else {
          this.reset();
          this.setState({ buttonDisable: false, Alert: { open: true, severity: "error", message: response.msg } });
        }
      });
    } catch (error) {
      this.setState({ buttonDisable: false });
      console.log(error);
      this.reset();
    }
  }

  goRegister() {
    this.setState({ page: "Register" });
  }

  goLogin() {
    this.setState({ page: "Login" });
  }

  handleCloseAlert = (event, reason) => {
    let NewAlert = this.state.Alert;
    NewAlert.open = false;
    this.setState({ Alert: NewAlert });
  };
  render() {

    if (this.state.page == "Login") {
      return (
        <div className="loginForm">
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: "right" }}
            open={this.state.Alert.open}
            autoHideDuration={5000}
            onClose={this.handleCloseAlert}
            key={"vertical"}>
            <Alert severity={this.state.Alert.severity} variant="filled" >{this.state.Alert.message}</Alert>
          </Snackbar>

          <a className="Text">Autentificare</a>
          <div className="InputDiv">
            <CostumeField
              fullWidth
              id="standard-search"
              label="Username"
              type="text"
              value={this.state.username}
              name="username"
              onChange={this.handleChange}
              variant="standard"
            />
            <CostumeField
              fullWidth
              id="standard-search"
              label="Password"
              type="password"
              value={this.state.password}
              name="password"
              onChange={this.handleChange}
              variant="standard"
            />
            <CostumeField className="HiddenFiled"
              fullWidth
              id="standard-search"
              label="Password"
              type="password"
              name="password"
              variant="standard" />
          </div>
          <div className="ButtonsDiv">
            <Button
              disabled={this.state.buttonDisable}
              variant="contained"
              color="success"
              onClick={() => this.doLogIn()}>
              LogIn
            </Button>
            <Button
              disabled={this.state.buttonDisable}
              variant="contained"
              color="success"
              onClick={() => this.goRegister()}>
              Register
            </Button>
            {this.state.redirect && <Navigate to='/' replace={true} />}
          </div>
        </div>)
    }
    else {
      return (

        <div className="RegisterForm">
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: "right" }}
            open={this.state.Alert.open}
            autoHideDuration={5000}
            onClose={this.handleCloseAlert}
            key={"vertical"}>
            <Alert severity={this.state.Alert.severity} variant="filled" >{this.state.Alert.message}</Alert>
          </Snackbar>
          <a className="Text">Inregistrare</a>
          <div className="InputDiv">
            <CostumeField
              fullWidth
              id="standard-search"
              label="Username"
              type="text"
              value={this.state.username}
              name="username"
              onChange={this.handleChange}
              variant="standard"
            />
            <CostumeField
              fullWidth
              id="standard-search"
              label="Password"
              type="password"
              value={this.state.password}
              name="password"
              onChange={this.handleChange}
              variant="standard"
            />
            <CostumeField
              fullWidth
              id="standard-search"
              label="Email"
              type="email"
              value={this.state.email}
              name="email"
              onChange={this.handleChange}
              variant="standard"
            />
          </div>
          <div className="ButtonsDiv">

            <Button
              disabled={this.state.buttonDisable}
              variant="contained"
              onClick={() => this.goLogin()}
            >LogIn</Button>
            <Button
              disabled={this.state.buttonDisable}
              variant="contained"
              onClick={() => this.doRegister()}>Register</Button>
          </div>
        </div>)
    }
  }
}

export default observer(Login_Page);

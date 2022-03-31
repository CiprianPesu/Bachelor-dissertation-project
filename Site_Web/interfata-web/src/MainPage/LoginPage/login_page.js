import React from "react";
import "./LoginPage.css";
import CurentUser from "../../stores/CurentUser";
import { observer } from "mobx-react";

import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material/';
import { Button } from '@mui/material/';
import { Navigate } from 'react-router-dom';

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
      redirect:false
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
        this.setState.page = "Login";
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

          this.setState({redirect:true})
          
        }
        else {
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
    this.setState({ page: "Register" });
  }

  goLogin() {
    this.setState({ page: "Login" });
  }


  render() {

    if (this.state.page == "Login") {
      return (
          <div className="loginForm">
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
                variant="standard"/>
            </div>
            <div className="ButtonsDiv">
              <Button
                disabled={this.state.disabled}
                variant="contained"
                color="success"
                onClick={() => this.doLogIn()}>
                LogIn
              </Button>
              <Button
                disabled={this.state.disabled}
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
                disabled={this.state.disabled}
                variant="contained"
                onClick={() => this.goLogin()}
              >LogIn</Button>
              <Button
                disabled={this.state.disabled}
                variant="contained"
                onClick={() => this.doRegister()}>Register</Button>

            </div>
        </div>)

    }

  }
}

export default observer(Login_Page);

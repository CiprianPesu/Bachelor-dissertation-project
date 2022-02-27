import logo from './logo.svg';
import './App.css';
import React from 'react';
import "./stores/CurentUser";
import { observer } from "mobx-react";
import Navbar from "./NavBar/Navbar";
import LoginPage from "./LoginPage/login_page.js";

import CurentUser from "./stores/CurentUser";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myaccount: "false",
      admin: "false",
    };
  }

  async componentDidMount() {
    try {
      let res = await fetch("/isLoggedIn", {
        method: "post",
        Headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: {},
      });

      await res.json().then((response) => {
        response=JSON.parse(response);
        if (response.success == true) {
          CurentUser.username = response.username;
          CurentUser.loading = false;
          CurentUser.isLoggedIn = true;
          CurentUser.admin = response.admin;
        }
        else {
          CurentUser.loading = false;
          CurentUser.isLoggedIn = false;
        }
      });
    } catch (error) {
      CurentUser.loading = false;
      CurentUser.isLoggedIn = false;
    }
  }

  async doLogOut() {
    try {
      let res = await fetch("/logout", {
        method: "post",
        Headers: {
          Accep: "application/json",
          "Content-Type": "application/json",
        },
      });

      await res.json().then((response) => {
        response=JSON.parse(response);
        if (response.success == true) {
          CurentUser.isLoggedIn = false;
          CurentUser.username = "";
        }
      });

     
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    if (CurentUser.isLoggedIn) {
      return (
        <div className="App">
          <div className='Navbar-space'>
            <Navbar></Navbar>
          </div>
          <div className='Page-content-space'>
          </div>
        </div>
      );
    }
    else if(CurentUser.loading){
      return (
        <div className="App">
          <div className='Navbar-space'>
            <Navbar empty = "True"></Navbar>
          </div>
          <div className='Page-content-space'>
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="App">
          <div className='Navbar-space'>
            <Navbar></Navbar>
          </div>
          <div className='Page-content-space'>
            <LoginPage></LoginPage>
          </div>
        </div>
      );
    }

  }
}



export default observer(App);

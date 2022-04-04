
import './App.css';
import React from 'react';
import "./stores/CurentUser";
import { observer } from "mobx-react";
import Navbar from "./NavBar/Navbar";
import CurentUser from "./stores/CurentUser";
import background from "./icons/images-blue.jpg";
import BeatLoader from "react-spinners/BeatLoader";

import { Routes, Route } from "react-router-dom";

import LoginPage from "./MainPage/LoginPage/login_page";
import GetViewNewsPage from "./MainPage/ViewNewsPage/GetViewNewsPage";
import GetNewsPage from "./MainPage/NewsPage/GetNewsPage";
import GetCostumeNewsPage from "./MainPage/NewsPage/GetCostumeNewsPage";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activ: "Main",
    };
  }

  setCurentUser(username, loading, isLoggedIn, admin, email, preference) {
    CurentUser.username = username;
    CurentUser.loading = loading;
    CurentUser.isLoggedIn = isLoggedIn;
    CurentUser.admin = admin;
    CurentUser.preference = preference;
    CurentUser.email=email;

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
        response = JSON.parse(response);
        if (response.success == true) {
          this.setCurentUser(response.username, false, true, response.admin, response.email, response.preference);
        }
        else {
          this.setCurentUser(CurentUser.username, false, false, CurentUser.admin, response.email, response.preference);
        }
      });
    } catch (error) {
      this.setCurentUser(CurentUser.username, false, false, CurentUser.admin, CurentUser.email, CurentUser.preference);
    }
  }

  render() {
    if (CurentUser.loading) {
      return (
        <div className="App" style={{
          backgroundImage: `url(${background})`, backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'repeat',
        }}>
          <div className='Navbar-space'>
            <Navbar form="empty"></Navbar>
          </div>
          <div className='Page-content-space'>
            <BeatLoader></BeatLoader>
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="App" style={{
          backgroundImage: `url(${background})`, backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'repeat',
        }}>
          <Routes>

            <Route path="/" element={
              <div>
                <div className='Navbar-space'>
                  <Navbar form="Full"></Navbar>
                </div>
                <div className='Page-content-space'>
                  <GetNewsPage></GetNewsPage>
                </div>
              </div>
            }>
            </Route>

            <Route path="costume" element={
              <div>
                <div className='Navbar-space'>
                  <Navbar form="Full"></Navbar>
                </div>
                <div className='Page-content-space'>
                  <GetCostumeNewsPage></GetCostumeNewsPage>
                </div>
              </div>
            }>
            </Route>

            <Route path="news">
              <Route path=":ViewNewsId" element={
                <div>
                  <div className='Navbar-space'>
                    <Navbar form="NoSearch"></Navbar>
                  </div>
                  <div className='Page-content-space'>
                    <GetViewNewsPage></GetViewNewsPage>
                  </div>
                </div>
              }></Route>
            </Route>


            <Route path="authentication" element={
              <div>
                <div className='Navbar-space'>
                  <Navbar form="NoSearch"></Navbar>
                </div>
                <div className='Page-content-space'>
                  <LoginPage></LoginPage>
                </div>
              </div>
            }></Route>

            <Route
              path="*"
              element={
                <div>
                  <div className='Navbar-space'>
                    <Navbar form="NoSearch"></Navbar>
                  </div>
                  <div className='Page-content-space'>
                    <main style={{ padding: "1rem" }}>
                      <p>There's nothing here!</p>
                    </main>
                  </div>
                </div>
              }
            />

          </Routes>
        </div>
      );
    }

  }
}

export default observer(App);

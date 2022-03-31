
import './App.css';
import React from 'react';
import "./stores/CurentUser";
import { observer } from "mobx-react";
import Navbar from "./NavBar/Navbar";
import MainPage from "./MainPage/MainPage";
import CurentUser from "./stores/CurentUser";
import background from "./icons/images-blue.jpg";
import BeatLoader from "react-spinners/BeatLoader";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activ: "Main",
      Searched: "",
    };
  }

  setCurentUser(username, loading, isLoggedIn, admin) {
    CurentUser.username = username;
    CurentUser.loading = loading;
    CurentUser.isLoggedIn = isLoggedIn;
    CurentUser.admin = admin;
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
          this.setCurentUser(response.username, false, true, response.admin);
        }
        else {
          this.setCurentUser(CurentUser.username, false, false, CurentUser.admin);
        }
      });
    } catch (error) {
      this.setCurentUser(CurentUser.username, false, false, CurentUser.admin);
    }
  }

  callbackFunctionSearch = (childData) => {
    this.setState({ Searched: childData })
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
            <Navbar empty="True"></Navbar>
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
          <div className='Navbar-space'>
            <Navbar
              DoSearch={this.callbackFunctionSearch}
            ></Navbar>
          </div>
          <div className='Page-content-space'>
            <MainPage
              page={this.state.activ}
              Searched={this.state.Searched}
            ></MainPage>
          </div>
        </div>
      );
    }

  }
}



export default observer(App);

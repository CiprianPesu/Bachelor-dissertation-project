import "./NavBar.css";
import React, { useState, useRef } from "react";
import { observer } from "mobx-react";

import DropdownMenu from "./DropDown";
import { ReactComponent as HomeIcon } from "../icons/home.svg";
import { ReactComponent as CaretIcon } from "../icons/caret.svg";
import NavItem from "./NavItem";

import CurentUser from "../stores/CurentUser";

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.children = props.children;
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
        if (response.success == true) {
          CurentUser.username = "";
          CurentUser.isLoggedIn = false;
          console.log("Logged out");
          
        }
      });
    } catch (error) {
      console.log(error);
    }
  }


  render() {
    if (this.props.empty != "True") {
      return (
        <nav className="navbar">
          <NavItem
            icon={<HomeIcon />}
            dropdown="false"
            onClick={() => this.toMainPage()}
          ></NavItem>
          <NavItem icon={<CaretIcon />} dropdown="true">
            <DropdownMenu
              logout={() => this.doLogOut()}
              tomyaccount={() => this.tomyaccount()}
              toMainPage={() => this.toMainPage()}
              username={CurentUser.username}
            ></DropdownMenu>
          </NavItem>
        </nav>
      );
    }
    else{
      return (
        <nav className="navbar"></nav>
      );
    }
  }
}

export default observer(Navbar);

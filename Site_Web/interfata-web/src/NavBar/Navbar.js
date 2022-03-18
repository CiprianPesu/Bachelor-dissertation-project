import "./NavBar.css";
import React from "react";
import { observer } from "mobx-react";
import DropdownMenu from "./DropDown";
import { ReactComponent as CaretIcon } from "../icons/caret.svg";
import { ReactComponent as SearchIcon } from "../icons/search.svg";

import NavItem from "./NavItem";


import { alpha, styled } from '@mui/material/styles';
import { InputBase } from '@mui/material/';

import CurentUser from "../stores/CurentUser";

const CostumeInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 5,
    position: 'relative',
    backgroundColor: 'transparent',
    
    fontSize: 18,
    width: '600px',
    padding: '5px',
    color: "white",
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    '&:focus': {
      boxShadow: `${alpha("#74aa9d", 0.25)} 0 0 0 0.2rem`,
      border: '2px solid #74aa9d',
    },
  },
}));



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
        if (response.success === true) {
          CurentUser.username = "";
          CurentUser.isLoggedIn = false;
          console.log("Logged out");

        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  back() {
    this.props.ToMain();
  }


  render() {
    if (this.props.empty !== "True") {
      return (
        <nav className="navbar">
          <div className="left-box">
            <a>BBC</a>
            <a>CNN</a>
            <a>FOX</a>
            <a>Costume</a>
            <a onClick={() => this.props.ToMain()}>Latest</a>
          </div>

          <div className="SearchBox">
            <CostumeInput
              id="standard-search"
              label="Search field"
              type="search"
              size="small`"
              variant="standard"
              className="Inputfield"
              placeholder="Search..."
            />
            <div className="Spacer"></div>
            <div className="Search-Button">
              <NavItem
                icon={<SearchIcon />}
                dropdown="false"
                onClick={this.props.ToMain}
              ></NavItem>
            </div>

          </div>

          <div className="right-box">
            <NavItem icon={<CaretIcon />} dropdown="true">
              <DropdownMenu
                logout={() => this.doLogOut()}
                tomyaccount={() => this.tomyaccount()}
                ToLogIn={this.props.ToLogIn}
                username={CurentUser.username}
              ></DropdownMenu>
            </NavItem>
          </div>
        </nav>
      );
    }
    else {
      return (
        <nav className="navbar"></nav>
      );
    }
  }
}

export default observer(Navbar);

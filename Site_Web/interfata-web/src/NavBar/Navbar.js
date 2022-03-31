import "./NavBar.css";
import React from "react";
import { observer } from "mobx-react";
import DropdownMenu from "./DropDown";
import { ReactComponent as CaretIcon } from "../icons/caret.svg";
import { ReactComponent as SearchIcon } from "../icons/search.svg";
import NavItem from "./NavItem";
import { styled } from '@mui/material/styles';
import { InputBase } from '@mui/material/';

import CurentUser from "../stores/CurentUser";
import { Link } from "react-router-dom";

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
  },
}));



class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.children = props.children;
    this.state = {Searched:""}

    this.handleSearchClick = this.handleSearchClick.bind(this);
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

  handleChange = (event) => {
    let val = event.target.value;

    this.setState({
      Searched: val,
    });

  };

  handleSearchClick  = (event) =>{
    this.props.DoSearch(this.state.Searched);
  }

  render() {
    if (this.props.empty !== "True") {
      return (
        <nav className="navbar">
          <div className="left-box">
            <Link to="/" ><a>Latest</a></Link>
            <a>Costume</a>
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
              value={this.state.Searched}
              onChange={this.handleChange}
            />
            <div className="Spacer"></div>
            <div className="Search-Button">
              <NavItem
                icon={<SearchIcon />}
                dropdown="false"
                onClick={this.handleSearchClick}
              ></NavItem>
            </div>

          </div>

          <div className="right-box">
            <NavItem icon={<CaretIcon />} dropdown="true">
              <DropdownMenu
                logout={() => this.doLogOut()}
                tomyaccount={() => this.tomyaccount}
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

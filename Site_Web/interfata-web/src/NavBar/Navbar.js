import "./NavBar.css";
import React from "react";
import { observer } from "mobx-react";
import DropdownMenu from "./DropDown";
import { ReactComponent as CaretIcon } from "../icons/caret.svg";
import { ReactComponent as SearchIcon } from "../icons/search.svg";
import NavItem from "./NavItem";
import { styled } from '@mui/material/styles';
import { InputBase } from '@mui/material/';
import { Navigate } from 'react-router-dom';
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

    let CurentUrl = window.location.href.split("?")

    let Searched = ""

    if (CurentUrl.length > 1) {
      let CurentUrlPrefix = CurentUrl[1].split("Search=")

      if (CurentUrlPrefix.length > 1) {
        Searched = CurentUrlPrefix[1].split("&")[0]
      }
    }


    this.state = {
      LinkTo: "",
      Searched: Searched
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
    let newUrl = "";

    let CurentUrl = window.location.href.split("?")

    if (CurentUrl.length == 1) {
      newUrl = "?Search=" + val
    }
    else {
      if(CurentUrl[1].includes("Search=")){

        if(CurentUrl[1].includes("&")){

          newUrl = "?Search=" + val + "&" + CurentUrl[1].substring(CurentUrl[1].indexOf('&')+1)

          if(newUrl.includes("page=")){
            newUrl = newUrl.split("page=")[0];
          }

        }
        else{
          newUrl = "?Search=" + val
        }
      }
      else{
        newUrl = "?Search=" + val + "&" + CurentUrl[1]
      }
    }

    this.setState({
      Searched: val,
      LinkTo: newUrl,
    });

  };

  render() {
    if (this.props.form == "Full") {
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
              <Link to={this.state.LinkTo}>
                <NavItem
                  icon={<SearchIcon />}
                  dropdown="false"
                ></NavItem></Link>
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
    else if ((this.props.form == "NoSearch")) {
      return (
        <nav className="navbar">
          <div className="left-box">
            <Link to="/" ><a>Latest</a></Link>
            <a>Costume</a>
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
      )
    }
    else {
      return (
        <nav className="navbar"></nav>
      );
    }
  }
}

export default observer(Navbar);

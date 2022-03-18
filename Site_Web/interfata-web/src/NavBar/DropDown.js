import "./DropDown.css";

import React, { useState, useEffect, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import CurentUser from "../stores/CurentUser";

import { ReactComponent as CogIcon } from "../icons/cog.svg";
import { ReactComponent as ChevronIcon } from "../icons/chevron.svg";
import { ReactComponent as ArrowIcon } from "../icons/arrow.svg";
import { ReactComponent as BoltIcon } from "../icons/bolt.svg";
import { ReactComponent as UserIcon } from "../icons/user.svg";
import { observer } from "mobx-react";

function DropdownMenu(props) {
  const [activeMenu, setActiveMenu] = useState(props.dropDown);
  const [menuBorder, setMenuBorder] = useState(0);
  const [menuHeight, setMenuHeight] = useState(0);
  const [menuTop, setMenuTop] = useState(0);
  const dropdownRef = useRef(null);

  const Topheight = dropdownRef.clientHight;

  window.addEventListener('resize', handleResize)

  const parentRef = props.parentRef;
  function handleResize() {
    if (window.innerHeight < 190) {
      setMenuHeight(0);
      setMenuBorder(0);
      setActiveMenu("close")
    }
    setMenuTop(window.innerHeight)
  }

  useEffect(() => {
    if (window.innerHeight > 190) {
      setMenuTop(Topheight)
      setMenuHeight(dropdownRef.current?.firstChild.offsetHeight);
      setActiveMenu(props.dropDown);
      setMenuTop(window.innerHeight)
    }

  }, [props.dropDown, CurentUser.isLoggedIn]);

  function calcHeight(el) {
    const height = el.offsetHeight;
    setMenuHeight(height);
    setMenuBorder("1px solid #474a4d");
  }

  function close_calcHeight(el) {
    const height = el.offsetHeight;
    setMenuHeight(height);
    setMenuBorder(0);
  }

  function DropdownItem(props) {
    return (
      <a
        href={props.link}
        className="menu-item"
        onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}
      >
        <span className="icon-button">{props.leftIcon}</span>
        {props.children}
        <span className="icon-right">{props.rightIcon}</span>
      </a>
    );
  }

  function DropdownItemButton(props) {
    return (
      <a href={props.link} className="menu-item" onClick={props.onClick}>
        <span className="icon-button">{props.leftIcon}</span>
        {props.children}
        <span className="icon-right">{props.rightIcon}</span>
      </a>
    );
  }

  if (menuTop > 640) {
    if (CurentUser.isLoggedIn) {
      return (
        <div
          className="dropdown"
          style={{ height: menuHeight, padding: 0, border: menuBorder }}
          ref={dropdownRef}
          onTimeUpdate
        >
          <CSSTransition
            in={activeMenu === "main"}
            timeout={500}
            classNames="menu-primary"
            unmountOnExit
            onEnter={calcHeight}
          >
            <div className="menu">
              <DropdownItemButton
                leftIcon={<UserIcon />}
                link="#"
                goToMenu="close"
                onClick={props.tomyaccount}
              >
                {CurentUser.username}
              </DropdownItemButton>
              <DropdownItem
                leftIcon={<CogIcon />}
                rightIcon={<ChevronIcon />}
                goToMenu="settings"
              >
                Settings
              </DropdownItem>

              <DropdownItemButton link="#" onClick={props.logout} leftIcon={<UserIcon />}>
                Log Out
              </DropdownItemButton>
            </div>
          </CSSTransition>

          <CSSTransition
            in={activeMenu === "settings"}
            timeout={500}
            classNames="menu-secondary"
            unmountOnExit
            onEnter={calcHeight}
          >
            <div className="menu">
              <DropdownItem goToMenu="main" leftIcon={<ArrowIcon />}>
                Back
              </DropdownItem>
              <DropdownItem leftIcon={<BoltIcon />}>HTML</DropdownItem>
            </div>
          </CSSTransition>

          <CSSTransition
            in={activeMenu === "close"}
            timeout={500}
            classNames="menu-secondary"
            unmountOnExit
            onEnter={close_calcHeight}
          >
            <div className="menu"></div>
          </CSSTransition>
        </div>
      );
    }
    else {
      return (
        <div
          className="dropdown"
          style={{ height: menuHeight, padding: 0, border: menuBorder }}
          ref={dropdownRef}
        >
          <CSSTransition
            in={activeMenu === "main"}
            timeout={500}
            classNames="menu-primary"
            unmountOnExit
            onEnter={calcHeight}
          >
            <div className="menu">

              <DropdownItemButton 
               link="#"
               onClick={props.ToLogIn} 
               leftIcon={<UserIcon />}>
                Log In
              </DropdownItemButton>
              <DropdownItem
                leftIcon={<CogIcon />}
                rightIcon={<ChevronIcon />}
                goToMenu="settings"
              >
                Settings
              </DropdownItem>

            </div>
          </CSSTransition>

          <CSSTransition
            in={activeMenu === "settings"}
            timeout={500}
            classNames="menu-secondary"
            unmountOnExit
            onEnter={calcHeight}
          >
            <div className="menu">
              <DropdownItem goToMenu="main" leftIcon={<ArrowIcon />}>
                Back
              </DropdownItem>
              <DropdownItem leftIcon={<BoltIcon />}>HTML</DropdownItem>
            </div>
          </CSSTransition>

          <CSSTransition
            in={activeMenu === "close"}
            timeout={500}
            classNames="menu-secondary"
            unmountOnExit
            onEnter={close_calcHeight}
          >
            <div className="menu"></div>
          </CSSTransition>
        </div>
      );
    }

  }
  else {
    if (CurentUser.isLoggedIn) {
      return (
        <div
          className="dropdown"
          style={{ height: menuHeight, padding: 0, border: menuBorder }}
          ref={dropdownRef}
        >
          <CSSTransition
            in={activeMenu === "main"}
            timeout={500}
            classNames="menu-primary"
            unmountOnExit
            onEnter={calcHeight}
          >
            <div className="menu">
              <DropdownItemButton
                leftIcon={<UserIcon />}
                link="#"
                goToMenu="close"
                onClick={props.tomyaccount}
              >
                {CurentUser.username}
              </DropdownItemButton>
              <DropdownItem
                leftIcon={<CogIcon />}
                rightIcon={<ChevronIcon />}
                goToMenu="settings"
              >
                Settings
              </DropdownItem>

              <DropdownItemButton link="#" onClick={props.logout} leftIcon={<UserIcon />}>
                Log Out
              </DropdownItemButton>
            </div>
          </CSSTransition>

          <CSSTransition
            in={activeMenu === "settings"}
            timeout={500}
            classNames="menu-secondary"
            unmountOnExit
            onEnter={calcHeight}
          >
            <div className="menu">
              <DropdownItem goToMenu="main" leftIcon={<ArrowIcon />}>
                Back
              </DropdownItem>
              <DropdownItem leftIcon={<BoltIcon />}>HTML</DropdownItem>
            </div>
          </CSSTransition>

          <CSSTransition
            in={activeMenu === "close"}
            timeout={500}
            classNames="menu-secondary"
            unmountOnExit
            onEnter={close_calcHeight}
          >
            <div className="menu"></div>
          </CSSTransition>
        </div>
      );
    }
    else {
      return (
        <div
          className="dropdown"
          style={{ height: menuHeight, padding: 0, border: menuBorder}}
          ref={dropdownRef}
        >
          <CSSTransition
            in={activeMenu === "main"}
            timeout={500}
            classNames="menu-primary"
            unmountOnExit
            onEnter={calcHeight}
          >
            <div className="menu">
            <DropdownItemButton 
               link="#"
               onClick={props.ToLogIn} 
               leftIcon={<UserIcon />}>
                Log In
              </DropdownItemButton>
              <DropdownItem
                leftIcon={<CogIcon />}
                rightIcon={<ChevronIcon />}
                goToMenu="settings"
              >
                Settings
              </DropdownItem>
            </div>
          </CSSTransition>

          <CSSTransition
            in={activeMenu === "settings"}
            timeout={500}
            classNames="menu-secondary"
            unmountOnExit
            onEnter={calcHeight}
          >
            <div className="menu">
              <DropdownItem goToMenu="main" leftIcon={<ArrowIcon />}>
                Back
              </DropdownItem>
              <DropdownItem leftIcon={<BoltIcon />}>HTML</DropdownItem>
            </div>
          </CSSTransition>

          <CSSTransition
            in={activeMenu === "close"}
            timeout={500}
            classNames="menu-secondary"
            unmountOnExit
            onEnter={close_calcHeight}
          >
            <div className="menu"></div>
          </CSSTransition>
        </div>
      );
    }
  }

}

export default observer(DropdownMenu);

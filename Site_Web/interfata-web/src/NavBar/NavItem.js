import "./Navitem.css";
import React, { useState } from "react";
import { observer } from "mobx-react";

class NavItem extends React.Component {
  constructor(props) {
    super(props);
    this.icon = props.icon;
    this.children = props.children;

    this.state = {
      down_meniu: "close",
    };

    this.toggleState = this.toggleState.bind(this);
  }

  toggleState() {
    if (this.state.down_meniu == "close") {
      this.setState({ down_meniu: "main" });
    } else {
      this.setState({ down_meniu: "close" });
    }
  }

  render() {
    const childrenWithProps = React.Children.map(this.children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          dropDown: this.state.down_meniu,
        });
      }
      return child;
    });

    if (this.props.dropdown == "true") {
      return (
        <li className="nav-item">
          <a
            href="#"
            className="icon-button"
            onClick={() => this.toggleState()}
          >
            {this.icon}
          </a>
          {childrenWithProps}
        </li>
      );
    } else {
      return (
        <li className="nav-item">
          <a href="#" className="icon-button" onClick={this.props.onClick}>
            {this.icon}
          </a>
        </li>
      );
    }
  }
}

export default observer(NavItem);

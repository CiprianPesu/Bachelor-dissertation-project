import React from "react";
import "./MyButton.css";

class MyButton extends React.Component {
  render() {
    return (
      <div className="MyButton">
        <button
          className="btn"
          disabled={this.props.disabled}
          color={this.props.color}
          onClick={() => this.props.onClick()}
        >
          {this.props.text}
        </button>
      </div>
    );
  }
}

export default MyButton;

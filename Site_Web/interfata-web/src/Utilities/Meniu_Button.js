import React from "react";
import "./Meniu_Button.css";

class Meniu_Button extends React.Component {
  render() {
    if (this.props.text === this.props.active)
      return (
        <div className="Meniu_Button">
          <button
            className="btn-meniu"
            disabled={this.props.disabled}
            color={this.props.color}
            corner={this.props.corner}
            onClick={() => this.props.onClick()}
          >
            {this.props.text}
          </button>
        </div>
      );
    else {
      return (
        <div className="Meniu_Button">
          <button
            className="btn-meniu"
            disabled={this.props.disabled}
            corner={this.props.corner}
            onClick={() => this.props.onClick()}
          >
            {this.props.text}
          </button>
        </div>
      );
    }
  }
}

export default Meniu_Button;

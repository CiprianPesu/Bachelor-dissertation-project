import React from "react";
import "./MyInput.css";
class MyInput extends React.Component {
  render() {
    return (
      <div className="form__group field">
        <input
          className="form__field"
          type={this.props.type}
          placeholder={this.props.placeholder}
          value={this.props.value}
          onChange={(e) => this.props.onChange(e.target.value)}
          color={this.props.color}
        >
          {this.props.text}
        </input>
        <label className="form__label" >
          {this.props.placeholder}
        </label>
      </div>
    );
  }
}

export default MyInput;

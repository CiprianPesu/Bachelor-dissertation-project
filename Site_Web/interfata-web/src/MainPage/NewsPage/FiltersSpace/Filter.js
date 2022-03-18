import React from "react";
import "./Filter.css";

import CheckBoxFilter from "./Filters/CheckBoxFilter";
import DoubleSliderFilter from "./Filters/DoubleSliderFilter";
import SelectFilter from "./Filters/SelectFilter";

class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeMenu: "false",

      ID: props.ID,
      Title: props.Title,
      Type: props.Type,
      Options: props.Options,

      value: [0, 100]
    };
  }

  calcHeight() {
    const height = this.offsetHeight;
    this.setState({ menuHeight: height })
  }

  sendBack() {
    this.props.parentCallback({
      cardID: this.state.ID,
      IBAN: this.state.IBAN,
      Suma: this.state.Suma,
      Moneda: this.state.Moneda,
      Denumire: this.state.Denumire,
      UserId: this.state.UserId,
    });
  }

  handleChange = (event, newValue) => {
    this.setState({ value: newValue });
  };


  changeHandleData0 = e => {
    this.setState({ value: [e.target.value, this.state.value[1]] })
  }

  changeHandleData1 = e => {
    this.setState({ value: [this.state.value[0], e.target.value] })
  }



  render() {
    if (this.state.Type == "CheckBox") {
      return (
        <CheckBoxFilter
          callBack={this.props.callBack}
          Title={this.state.Title}
          Type={this.state.Type}
          Options={this.state.Options}>
        </CheckBoxFilter>)
    }
    else if (this.state.Type == "DoubleSlider") {
      return (
        <DoubleSliderFilter
          callBack={this.props.callBack}
          Title={this.state.Title}
          Type={this.state.Type}
          Limits={this.state.Options.Limits}
        ></DoubleSliderFilter>
      )
    }
    else {
      return (
        <SelectFilter
          callBack={this.props.callBack}
          Title={this.state.Title}
          Type={this.state.Type}
          Options={this.state.Options}>
        </SelectFilter>)
    }
  }
}


export default Filter;
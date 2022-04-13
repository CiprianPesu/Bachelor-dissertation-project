import React from "react";
import "./Filter.css";

import CheckBoxFilter from "./Filters/CheckBoxFilter";
import DoubleSliderFilter from "./Filters/DoubleSliderFilter";
import SelectFilter from "./Filters/SelectFilter";

class Filter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.Type == "CheckBox") {
      return (
        <CheckBoxFilter
          callBack={this.props.callBack}
          Title={this.props.Title}
          Type={this.props.Type}
          Options={this.props.Options}
          Default={this.props.Default}
          FilterTarget={this.props.FilterTarget}
          ></CheckBoxFilter>)
    }
    else if (this.props.Type == "DoubleSlider") {
      return (
        <DoubleSliderFilter
          callBack={this.props.callBack}
          Title={this.props.Title}
          Type={this.props.Type}
          Limits={this.props.Options.Limits}
          Step={this.props.Options.Step}
          FilterTarget={this.props.FilterTarget}
        ></DoubleSliderFilter>
      )
    }
    else {
      return (
        <SelectFilter
          callBack={this.props.callBack}
          Title={this.props.Title}
          Type={this.props.Type}
          Options={this.props.Options}
          Default={this.props.Default}
          FilterTarget={this.props.FilterTarget}
        ></SelectFilter>)
    }
  }
}


export default Filter;
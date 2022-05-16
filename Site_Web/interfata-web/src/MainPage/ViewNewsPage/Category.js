
import React from "react";
import "./Category.css";

class Category extends React.Component {
  constructor(props) {
    super(props);
  }




  render() {

    let color = "white";

    if (this.props.Category === "SCIENCE") {
      color = "rgba(0,250,250,0.75)";

    }
    else if (this.props.Category === "ARTS & CULTURE") {
      color = "rgba(100,200,150,0.75)";
    }
    else if (this.props.Category === "BUSINESS") {
      color = "rgba(200,40,20,0.75)";
    }
    else if (this.props.Category === "TRAVEL") {
      color = "rgba(40,200,0,0.75)";
    }
    else if (this.props.Category === "POLITICS") {
      color = "rgba(255,50,50,0.75)";
    }
    else if (this.props.Category === "HEALTHY LIVING") {
      color = "rgba(200,250,250,0.75)";
    }
    else if (this.props.Category === "FOOD & DRINK") {
      color = "rgba(250,150,100,0.75)";
    }
    else if (this.props.Category === "CRIME") {
      color = "rgba(255,0,30,0.75)";
    }
    else if (this.props.Category === "HOME & LIVING") {
      color = "rgba(255,0,100,0.75)";
    }
    else if (this.props.Category === "RELIGION") {
      color = "rgba(155,75,75,0.75)";
    }
    else if (this.props.Category === "STYLE & BEAUTY") {
      color = "rgba(155,255,105,0.75)";
    }
    else if (this.props.Category === "SPORTS") {
      color = "rgba(30,100,255,0.75)";
    }
    else if (this.props.Category === "ENVIRONMENT") {
      color = "rgba(10,255,25,0.75)";
    }
    else if (this.props.Category === "ENTERTAINMENT") {
      color = "rgba(250,250,55,0.75)";
    }
    else if (this.props.Category === "EDUCATION") {
      color = "rgba(250,0,255,0.75)";
    }

    if (this.props.Size == "small") {
      return (
        <div className="Category-Outer" style={{ background: color, width: "90px", }}>
          <div className="Category-Category" style={{ fontSize: "10px" }}>
            {this.props.Category}
          </div>
          <div className="Category-Procent" style={{ fontSize: "10px" }}>
            {parseInt(this.props.Procent * 100)}%
          </div>
        </div>
      )
    }
    else {
      return (
        <div className="Category-Outer" style={{ background: color, width: "140px", }}>
          <div className="Category-Category" style={{ fontSize: "16px" }}>
            {this.props.Category}
          </div>
          <div className="Category-Procent" style={{ fontSize: "16px" }}>
            {parseInt(this.props.Procent * 100)}%
          </div>
        </div>
      )
    }
  }
}

export default Category;

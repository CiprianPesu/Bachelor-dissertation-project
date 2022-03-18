import { buildQueries } from "@testing-library/dom";
import React from "react";
import "./MainPage.css";
import LoginPage from "./LoginPage/login_page";
import NewsPage from "./NewsPage/NewsPage";

class MainPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: props.page,
    };
  }

  render() {

    if (this.props.page == "Main") {
      return (
        <NewsPage></NewsPage>
      )
    }
    else if (this.props.page == "LogIn") {
      return (
        <div className="Page">
          <LoginPage
            ToMain={this.props.ToMain}
          ></LoginPage>
        </div>
      );
    }
  }
}

export default MainPage;

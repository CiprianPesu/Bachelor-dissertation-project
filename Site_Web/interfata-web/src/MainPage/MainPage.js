import React from "react";
import "./MainPage.css";
import { Routes, Route } from "react-router-dom";

import LoginPage from "./LoginPage/login_page";
import NewsPage from "./NewsPage/NewsPage";
import GetViewNewsPage from "./ViewNewsPage/GetViewNewsPage";
class MainPage extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {

    return (
      <Routes>
        <Route path="/" element={<NewsPage Searched={this.props.Searched}></NewsPage>}></Route>
        <Route path="news">
          <Route path=":ViewNewsId" element={<GetViewNewsPage></GetViewNewsPage>}></Route>
        </Route>
        <Route path="authentication" element={<LoginPage></LoginPage>}></Route>
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>
    )
  }
}

export default MainPage;

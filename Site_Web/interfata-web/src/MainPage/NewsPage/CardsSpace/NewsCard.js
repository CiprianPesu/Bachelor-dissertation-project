import React from "react";
import "./NewsCard.css";
import {Navigate} from 'react-router-dom';
import { createBrowserHistory } from 'history';

import { ReactComponent as BBC } from "../../../icons/bbc-2.svg";
import { ReactComponent as FoxNews } from "../../../icons/fox-3.svg";
import { ReactComponent as CNN } from "../../../icons/cnn-logo.svg";

const history = createBrowserHistory();

class NewsCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ID: props.ID,
      redirect:false,
    };
  }

  handleClick  = (event) =>{
    history.push(window.location.href);
    this.setState({redirect:true})
  }

  render() {

    let Svg = BBC;
    if (this.props.Publication === "FOX News") {
      Svg = FoxNews;
    }
    else if (this.props.Publication === "BBC") {
      Svg = BBC;
    }
    else if (this.props.Publication === "CNN") {
      Svg = CNN;
    }

    return (
      <div className="OuterCard"
      onClick={this.handleClick}
      >
        <div className="News" Publication={this.props.Publication}>
          <div className="SvgSpace">
            <Svg />
          </div>

          <div className="News-Title">
          &emsp;{this.props.Title}</div>
          <div className="News-Description">&emsp;{this.props.Description}</div>
          <div className="News-pubDate">{this.props.PubDate}</div>
        </div>
        {this.state.redirect && <Navigate to={"/news/"+this.state.ID} replace={true} />}
      </div>
    );
  }
}

export default NewsCard;
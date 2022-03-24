import React from "react";
import "./NewsCard.css";

class NewsCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ID: props.ID,
    };
  }

  render() {
    return (
      <div className="OuterCard">
        <div className="News">
          <div className="News-Title">{this.props.Title}</div>
          <div className="News-Description">{this.props.Description}</div>
          <div className="News-pubDate">{this.props.pubDate}</div>
        </div>
      </div>
    );
  }
}

export default NewsCard;
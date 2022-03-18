import React from "react";
import "./NewsCard.css";

class NewsCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ID: props.ID,
      Title: props.Title,
      Description: props.Description,
      pubDate:props.pubDate,
    };
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

  render() {
    return (
      <div className="OuterCard">
        <div className="News">
          <div className="News-Title">{this.state.Title}</div>
          <div className="News-Description">{this.state.Description}</div>
          <div className="News-pubDate">{this.state.pubDate}</div>
        </div>
      </div>
    );
  }
}

export default NewsCard;
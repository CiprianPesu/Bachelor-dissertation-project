import React from "react";
import "./Paragrafe.css";
import Paragraf from "./Paragraf";

class ParagarfSpace extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
        <div className="ViewNewsSpace-Paragraphes">{this.props.Paragraf_Objects.map((i, index) => (
            <Paragraf
                sentiment={i.Sentiment}
                Paragraf={i.Text}
            ></Paragraf>
          ))}</div>)
    }
}

export default ParagarfSpace;
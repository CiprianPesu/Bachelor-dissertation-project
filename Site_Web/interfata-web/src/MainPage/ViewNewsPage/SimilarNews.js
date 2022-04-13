import React from "react";
import "./SimilarNews.css";
import { Link } from "react-router-dom";
import { createBrowserHistory } from 'history';

import { ReactComponent as BBC } from "../../icons/bbc-2.svg";
import { ReactComponent as FoxNews } from "../../icons/fox-3.svg";
import { ReactComponent as CNN } from "../../icons/cnn-logo.svg";
const history = createBrowserHistory();

class SimilarNews extends React.Component {
    constructor(props) {
        super(props);
    }



    render() {
        let Svg = BBC;
        let fill = "black";
        if (this.props.RSSTag === "FOX News") {
            Svg = FoxNews;
            fill = "rgba(0,101 ,152, 1)"
        }
        else if (this.props.RSSTag === "BBC") {
            Svg = BBC;
        }
        else if (this.props.RSSTag === "CNN") {
            Svg = CNN;
            fill = "rgba(234,0 ,0, 1)"
        }

        return (
            <Link to={"/news/"+this.props.ID} style={{ textDecoration: "none", color:"black"}}>
                <div className="Outer-SimilarNews" onClick={this.handleClick} >
                    <div className="SimilarNews-SvgSpace">
                        <a style={{ fill: fill }}><Svg></Svg></a>
                    </div>
                    <div className="SimilarNews-Title" >
                        &emsp;{this.props.title}
                    </div>
                    <div className="SimilarNews-pubDate" style={{ color: fill, textAlign: "right", marginTop: "10px" }}>{this.props.pubDate}</div>
                </div>
            </Link>
        )
    }
}

export default SimilarNews;
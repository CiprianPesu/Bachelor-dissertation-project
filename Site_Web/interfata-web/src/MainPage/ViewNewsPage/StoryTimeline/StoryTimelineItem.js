import React from "react";
import "./StoryTimeline.css";
import { Link } from "react-router-dom";
import { ReactComponent as BBC } from "../../../icons/bbc-2.svg";
import { ReactComponent as FoxNews } from "../../../icons/fox-3.svg";
import { ReactComponent as CNN } from "../../../icons/cnn-logo.svg";

class StoryTimelineItem extends React.Component {
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

        var PubDate = new Date(this.props.pubDate);

        return (
            <Link to={"/news/" + this.props.ID} style={{ textDecoration: "none",color: "black", marginLeft: "auto", marginRight: "auto" }}>
                <div className="StoryTimelineItem">
                    <div className="SimilarNews-SvgSpace" style={{marginLeft: "auto", marginRight: "auto" }}>
                        {this.props.CurentNews && <div style={{ background: "green", height:"12px",width:"12px", borderRadius:"12px",margin:"auto"}}></div>}
                        <a style={{ fill: fill}}><Svg></Svg></a>
                    </div>
                    <div>{PubDate.toLocaleDateString()}</div>
                    <div>{PubDate.toLocaleTimeString('en-IT', { hour12: false })}</div>
                </div>
            </Link>)
    }
}


export default StoryTimelineItem;
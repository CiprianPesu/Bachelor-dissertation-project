import React from "react";
import RecomandedNews from "./RecomandedNews";
import "./RecomandedNews.css";
import { ReactComponent as TooltipIcon } from "../../../icons/help.svg";
import { Tooltip } from '@mui/material/';
import Zoom from '@mui/material/Zoom';
import BeatLoader from "react-spinners/BeatLoader";

class RecomandedNewsSpace extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.recived === false) {
            return (
                <div className="More-RecomandedNews">
                    <div className="More-RecomandedNews-Title">
                        <Tooltip
                            placement="bottom"
                            TransitionComponent={Zoom}
                            title={"Similar news are determined using the cosine similarity between the vectors representing the current article and vectors representing news from our database"}>
                            <TooltipIcon></TooltipIcon>
                        </Tooltip>
                        <div style={{ "margin": "auto", }}>Recomanded News</div>
                    </div>
                    <div className="More-RecomandedNews-NewsSpace">
                        <BeatLoader></BeatLoader>
                    </div>
                </div>)
        }
        else if (this.props.RecomandedNews.length === 0) {
            return (
                <div className="More-RecomandedNews">
                    <div className="More-RecomandedNews-Title">
                        <Tooltip
                            placement="bottom"
                            TransitionComponent={Zoom}
                            title={"Similar news are determined using the cosine similarity between the vectors representing the current article and vectors representing news from our database"}>
                            <TooltipIcon></TooltipIcon>
                        </Tooltip>
                        <div style={{ "margin": "auto", }}>Recomanded News</div>
                    </div>
                    <div className="More-RecomandedNews-NewsSpace">
                        <div style={{ margin:"10px" }}>No recomanded news were found</div>
                    </div>
                </div>)
        }
        else {
            return (
                <div className="More-RecomandedNews">
                    <div className="More-RecomandedNews-Title">
                        <Tooltip
                            placement="bottom"
                            TransitionComponent={Zoom}
                            title={"Similar news are determined using the cosine similarity between the vectors representing the current article and vectors representing news from our database"}>
                            <TooltipIcon></TooltipIcon>
                        </Tooltip>
                        <div style={{ "margin": "auto", }}>Recomanded News</div>
                    </div>
                    <div className="More-RecomandedNews-NewsSpace">
                        {this.props.RecomandedNews.map((i, index) => (
                            <RecomandedNews
                                title={i.title}
                                RSSTag={i.RSSTag}
                                pubDate={i.pubDate}
                                ID={i.id}
                                Category={i.Category}
                            ></RecomandedNews>
                        ))}</div>
                </div>
            )
        }
    }
}

export default RecomandedNewsSpace;
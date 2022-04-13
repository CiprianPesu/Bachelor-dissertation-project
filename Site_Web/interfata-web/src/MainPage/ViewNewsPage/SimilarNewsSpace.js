import React from "react";
import SimilarNews from "./SimilarNews";
import "./SimilarNews.css";
import { ReactComponent as TooltipIcon } from "../../icons/help.svg";
import { Tooltip } from '@mui/material/';
import Zoom from '@mui/material/Zoom';
import BeatLoader from "react-spinners/BeatLoader";

class SimilarNewsSpace extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.SimilarNews.length === 0) {
            return (
                <div className="More-SimilarNews">
                    <div className="More-SimilarNews-Title">
                        <Tooltip
                            placement="bottom"
                            TransitionComponent={Zoom}
                            title={"Similar news are determined using the cosine similarity between the vectors representing the current article and vectors representing news from our database"}>
                            <TooltipIcon></TooltipIcon>
                        </Tooltip>
                        <div style={{ "margin": "auto", }}>Similar News</div>
                    </div>
                    <div className="More-SimilarNews-NewsSpace">
                        <BeatLoader></BeatLoader>
                    </div>
                </div>)
        }
        else {
            return (
                <div className="More-SimilarNews">
                    <div className="More-SimilarNews-Title">
                        <Tooltip
                            placement="bottom"
                            TransitionComponent={Zoom}
                            title={"Similar news are determined using the cosine similarity between the vectors representing the current article and vectors representing news from our database"}>
                            <TooltipIcon></TooltipIcon>
                        </Tooltip>
                        <div style={{ "margin": "auto", }}>Similar News</div>
                    </div>
                    <div className="More-SimilarNews-NewsSpace">
                        {this.props.SimilarNews.map((i, index) => (
                            <SimilarNews
                                title={i.title}
                                RSSTag={i.RSSTag}
                                pubDate={i.pubDate}
                                ID={i.id}
                            ></SimilarNews>
                        ))}</div>
                </div>
            )
        }
    }
}

export default SimilarNewsSpace;
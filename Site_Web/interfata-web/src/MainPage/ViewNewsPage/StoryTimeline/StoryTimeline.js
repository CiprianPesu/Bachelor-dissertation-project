import React from "react";
import { ReactComponent as TooltipIcon } from "../../../icons/help.svg";
import { Tooltip } from '@mui/material/';
import Zoom from '@mui/material/Zoom';
import StoryTimelineItem from "./StoryTimelineItem";
import "./StoryTimeline.css";

class StoryTimeline extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        let SameStoryNews = []

        this.props.SimilarNews.forEach(element => {
            if (element["similarity"] >= 0.9) {
                SameStoryNews.push(element);
            }
        });
        
        SameStoryNews.push(this.props.CurentNews)

        SameStoryNews.sort(function(a,b){
            return new Date(a["pubDate"]) - new Date(b["pubDate"]);
          });

        if (SameStoryNews.length < 2) {
            return (
                <div></div>)
        }
        else {
            return (
                <div className="More-StoryTimeline">
                    <div className="More-StoryTimeline-Title">
                        <Tooltip
                            placement="bottom"
                            TransitionComponent={Zoom}
                            title={"This list consists of news with a similarity score of 90% and higher arranged in chronological order"}>
                            <TooltipIcon></TooltipIcon>
                        </Tooltip>
                        <div style={{ "margin": "auto", }}>Story Timeline</div>
                    </div>
                    <div className="More-StoryTimeline-NewsSpace">
                        {SameStoryNews.map((i, index) => (
                            <StoryTimelineItem
                                pubDate={i["pubDate"]}
                                RSSTag={i["RSSTag"]}
                                ID={i["id"]}
                                CurentNews={i["curentNews"]}
                            ></StoryTimelineItem>

                        ))}
                    </div>
                </div>)
        }
    }
}

export default StoryTimeline;
import React from "react";
import BeatLoader from "react-spinners/BeatLoader";
import "./CardSpace.css";
import Card from "./NewsCard"
import InfiniteScroll from "react-infinite-scroll-component";
import { ReactComponent as SearchIcon } from "./../../../icons/search.svg";
class CardsSpace extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.loading === true) {
            return (
                <div className="News-Space-Loader">
                    <BeatLoader />
                </div>
            );
        }
        else if (this.props.items.length === 0) {
            return (<div className="News-Space-NoResult">
                <SearchIcon></SearchIcon>
                <br></br>
                <p>
                    Hmmm, we are not getting
                    any results. Try
                    another search
                </p>

            </div>)
        }
        else {
            return (
                <div className="News-Space">
                    <div className="List" id="scrollableDivNews">
                        <InfiniteScroll
                            dataLength={this.props.items.length}
                            scrollableTarget="scrollableDivNews"
                        >
                            <div className="CardsSpace">
                                {this.props.items.map((i, index) => (
                                    <Card
                                        key={i["id"]+index}
                                        ID={i["id"]}
                                        Title={i["title"]}
                                        Description={i["description"]}
                                        PubDate={i["pubDate"]}
                                        Publication={i["publication"]}
                                    ></Card>
                                ))}
                            </div>
                        </InfiniteScroll>
                    </div>
                </div>
            );
        }
    }
}

export default CardsSpace;
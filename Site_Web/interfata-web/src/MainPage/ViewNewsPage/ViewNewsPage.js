
import React from "react";
import BeatLoader from "react-spinners/BeatLoader";
import InfiniteScroll from "react-infinite-scroll-component";
import { ReactComponent as BBC } from "../../icons/bbc-2.svg";
import { ReactComponent as FoxNews } from "../../icons/fox-3.svg";
import { ReactComponent as CNN } from "../../icons/cnn-logo.svg";
import { ReactComponent as TooltipIcon } from "../../icons/help.svg";
import { Tooltip, Slider } from '@mui/material/';
import Zoom from '@mui/material/Zoom';
import { styled } from '@mui/material/styles';
import "./ViewNewsPage.css";
import SimilarNewsSpace from "./SimilarNewsSpace";

class ViewNewsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loding: true,
      success: false,
      link: "https://www.foxnews.com/us/shooting-near-nationals-park-after-baseball-game-leaves-4-injured",
      title: "4 injured in DC shooting near Nationals Park following baseball game",
      pubDate: "2022-04-10 11:18:21",
      content: "  Four people were injured in a shooting Saturday night near Nationals Park in Washington, D.C., less than an hour after the conclusion of the baseball game against the New York Mets.    The injured were all located on different sides of the ballpark. A female was taken to the hospital in serious condition. A man with a minor wound was reportedly found. Two additional males were located together with non-life threatening injuries, DC Fire told WJLA.         The victims have been identified as two men and two teens, NBC4 reports. They are a 16-year-old girl and 17-year-old boy.     The shootings took place about 40 minutes after the final out was recorded in the baseball game, according to the TV station.     Police are looking for a man who was reportedly wearing a black sweatshirt, light jeans who was carrying a silver handgun. They would also like to speak with a woman who was wearing a blue hoodie or jacket that had white writing on it.  To find out how to share information regarding these shootings to police, click here.     Three people were shot outside Nationals Park during a game against the San Diego Padres July 2021. A preliminary investigation determined that individuals inside two separate vehicles were firing guns at each other outside the stadium.    Fox News' Danielle Wallace contributed to this report.",
      Procent_Pozitiv: 0.40824673221661495,
      Word_Count: 224,
      RSSTag: "FOX News",
      image: "",


      SimilarNews: [
    ],
    }

    this.GetNewsByID = this.GetNewsByID.bind(this);
    this.GetSimilarNews = this.GetSimilarNews.bind(this);
  }


  componentDidMount() {
    this.GetNewsByID();
    this.GetSimilarNews();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.NewsID !== this.props.NewsID) {
      this.setState({
        loding: true,
        success: false,
        SimilarNews: [],
      })
      this.GetNewsByID();
      this.GetSimilarNews();
    }
  }


  async GetSimilarNews() {
    try {
      let res = await fetch("/GetSimilarNewsByID", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ID: this.props.NewsID,
        }),
      });

      await res.json().then((response) => {
        if (response.success == true) {
          this.setState({
            SimilarNews: response.data,
          })

        }
        else {
        }
      }
      );
    }
    catch (error) {

    }
  }

  async GetNewsByID() {
    try {
      let res = await fetch("/GetNewsByID", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ID: this.props.NewsID,
        }),
      });

      await res.json().then((response) => {
        if (response.success == true) {
          this.setState({
            loding: false,
            success: true,
            image: response.data.image,
            link: response.data.link,
            title: response.data.title,
            pubDate: response.data.pubDate,
            content: response.data.content,
            Procent_Pozitiv: response.data.Procent_Pozitiv,
            Word_Count: response.data.Word_Count,
            RSSTag: response.data.RSSTag,
          })

        }
        else {
          this.setState({
            loding: false,
            success: false
          })
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  render() {

    let Svg = BBC;
    let fill = "black";
    if (this.state.RSSTag === "FOX News") {
      Svg = FoxNews;
      fill = "rgba(0,101 ,152, 1)"
    }
    else if (this.state.RSSTag === "BBC") {
      Svg = BBC;
    }
    else if (this.state.RSSTag === "CNN") {
      Svg = CNN;
      fill = "rgba(234,0 ,0, 1)"
    }


    let color = "rgba(70,70, 70, 1)";
    if (this.state.Procent_Pozitiv <= 0.4) {
      color = "rgba(201,0, 0, 1)";

    }
    else if (this.state.Procent_Pozitiv >= 0.6) {
      color = "rgba(0,101 ,152, 1)";
    }

    let CostumeSlider = styled(Slider)(({ theme }) => ({
      color: 'rgb(81, 81, 81)',
      height: 2,
      display: "flex",
      justifyContent: "flex-end",
      padding: '15px 0',
      '& .MuiSlider-thumb': {
        height: 15,
        width: 15,
        backgroundColor: color,
        border: '1px solid currentColor',
        '&:hover': {
          boxShadow: '1 1 1 8px rgba(58, 133, 137, 0.16)',
        },
        '& .airbnb-bar': {
          height: 9,
          width: 1,
          marginLeft: 1,
          marginRight: 1,
        },
      },
    }));


    let paragraphes = this.state.content.split("  ");
    paragraphes = paragraphes.filter((paragraphe) => {
      return paragraphe !== "";
    });

    if (this.state.loding) {
      return (
        <div>
          <BeatLoader></BeatLoader>
        </div>
      )
    }
    else if (this.state.success === false) {
      return (
        <main style={{ padding: "1rem" }}>
          <p>There's nothing here!</p>
        </main>
      )
    }
    else {
      return (
        <div className="ViewNewsSpace" >
          <div className="ViewNews-PageContent">
            <div className="ViewNewsSpace-ScrollableContent" id="ViewNewsScrollableContent" RSSTag={this.state.RSSTag}>
              <InfiniteScroll
                dataLength={1}
                scrollableTarget="ViewNewsScrollableContent"
              >
                <div className="ViewNewsSpace-Content">
                  <div className="ViewNewsSpace-NewsContent">
                    <div className="ViewNewsSpace-Content-SvgSpace">
                      <a href={this.state.link} target="_blank" style={{ fill: fill }}><Svg></Svg></a>
                    </div>
                    <div className="ViewNewsSpace-Title">{this.state.title}</div>

                    <div className="ViewNewsSpace-pubDate" style={{ color: fill }}>{this.state.pubDate}</div>
                    {(this.state.image !="none") &&  <div className="ViewNewsSpace-Image"> <img src={this.state.image}></img></div>}
                    <div className="ViewNewsSpace-Paragraphes">{paragraphes.map((i, index) => (
                      <div className="ViewNewsSpace-Paragraph"> &emsp;{i}</div>
                    ))}</div>
                  </div>
                  <div className="ViewNewsSpace-More">
                    <div className="More-Sentiment">
                      <div className="More-Sentiment-Title">
                        <Tooltip
                          placement="bottom"
                          TransitionComponent={Zoom}
                          title={"The score is generated by an AI model, and it used to determine whether a given text contains negative, positive, or neutral emotions. A score of 0% represents strong negative emotions while a score of 100% represents strong positive emotions"}>
                          <TooltipIcon></TooltipIcon>
                        </Tooltip>
                        <div style={{ "margin-right": "auto" }}>Positivity score :</div>
                        <div style={{ "margin-left": "auto", "color": color }}>{(this.state.Procent_Pozitiv * 100).toFixed(2)}%</div>
                      </div>
                      <div className="More-Sentiment-Procent">
                        <CostumeSlider
                          value={this.state.Procent_Pozitiv.toPrecision(2)}
                          max={1}
                          min={0} />
                      </div>
                    </div>
                    <SimilarNewsSpace
                      SimilarNews={this.state.SimilarNews}
                    ></SimilarNewsSpace>
                  </div>
                </div>
              </InfiniteScroll>
            </div>

          </div>
        </div>
      )
    }
  }
}

export default ViewNewsPage;

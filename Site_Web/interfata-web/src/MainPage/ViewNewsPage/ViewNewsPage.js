
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
import SimilarNewsSpace from "./SimilarNews/SimilarNewsSpace";
import StoryTimeline from "./StoryTimeline/StoryTimeline";
import ParagarfSpace from "./ParagrafSpace/ParagarfSpace";
import Category from "./Category";

class ViewNewsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loding: true,
      success: false,
      link: "",
      title: "",
      pubDate: "",
      content: "",
      Paragraf_Pozitiv: "",
      Procent_Pozitiv: 0,
      Word_Count: 0,
      RSSTag: "",
      image: "",
      category:"",
      
      recivedSimilar:false,
      SimilarNews: [],
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
        recivedSimilar:false,
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
            recivedSimilar:true,
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
            Paragraf_Pozitiv: response.data.Paragraf_Pozitiv,
            category: response.data.Category,
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


    let sentiments = (this.state.Paragraf_Pozitiv).replace('[','').replace(']','').split(',');
    let paragraphes = this.state.content.split("*NewPARAGRAF*");

    let Paragraf_Objects = [];
    for (let i = 0; i < sentiments.length; i++) {
      Paragraf_Objects.push({
        Text: paragraphes[i],
        Sentiment: sentiments[i],
      })
    }
    
    let categoris = this.state.category.split("-");
    categoris.pop();
  
    
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

                    <div className="ViewNewsSpace-Category">
                      {
                        categoris.map((item, index) => {
                      
                          return (
                            <Category
                              key={index}
                              Category={item.split("*")[0]}
                              Procent={item.split("*")[1]}
                            ></Category>)                         
                        })
                      
                    }</div>

                    {(this.state.image != "none") && <div className="ViewNewsSpace-Image"> <img src={this.state.image}></img></div>}

                    

                    <ParagarfSpace
                      Paragraf_Objects={Paragraf_Objects}
                    ></ParagarfSpace>
                    <StoryTimeline
                      SimilarNews={this.state.SimilarNews}
                      CurentNews={{
                        pubDate: this.state.pubDate,
                        RSSTag: this.state.RSSTag,
                        curentNews:true,
                      }}
                    ></StoryTimeline>
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
                      recivedSimilar={this.state.recivedSimilar}
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

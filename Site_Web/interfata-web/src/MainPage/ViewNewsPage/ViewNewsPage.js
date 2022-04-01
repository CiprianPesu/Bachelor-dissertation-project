
import React from "react";
import BeatLoader from "react-spinners/BeatLoader";
import InfiniteScroll from "react-infinite-scroll-component";
import { ReactComponent as BBC } from "../../icons/bbc-2.svg";
import { ReactComponent as FoxNews } from "../../icons/fox-3.svg";
import { ReactComponent as CNN } from "../../icons/cnn-logo.svg";

import "./ViewNewsPage.css";
class ViewNewsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loding: true,
      success: false,
      link: "https://www.foxnews.com/entertainment/academy-aperture-2025-initiative",
      title: "As Academy's diversity initiative looms, some wonder if viewers will still be watching: 'Oscars are dead'",
      pubDate: "2022-03-26 09:49:00",
      content: "  The Academy Awards may soon have a greater problem on its hands than its current largely-discussed topic of a massive ratings slide.  Three years from now, the Academy of Motion Picture Arts and Sciences will begin implementing its Aperture 2025 initiative - a sweeping set of regulations designed to make Hollywood more equitable and diverse.  Beginning in 2024, film producers and directors will be required to submit to the Academy a dossier of the sort that points to the race, gender, sexual orientation, and disability status of their film's cast and crew members.  Not adhering to the stringent guidelines could prove detrimental for a project aspiring to be considered for a best picture nomination since the film could be disqualified from Oscar consideration if it does not employ enough people of color, people with disabilities or people who identify as LGBTQ+.   Other stipulations attached to the initiative - which was enacted in 2020, five years after the #OscarsSoWhite controversy - include what some have described as interference on how films are produced and what percentage of a plot heeds way for underrepresented groups of people.  The new diversity and inclusion requirements for Oscar consideration is not slated to take effect until 2024, but actress Kirstie Alley took to Twitter at the time to criticize the new rules writing, \"This is a disgrace to artists everywhere.\"   While intended with a larger goal in mind, determining a film's viability is already seen as a painstaking task. Calculating formulas and input from Academy members have already left many scratching their heads at whether a film will be eligible in the future given the notion that other variables may or may not be measured.  \"I mean, why aren't animals in this?\" one industry insider told Los Angeles magazine of the looming industry standard. \"What if the main character is a horse?\"  Another Hollywood source described the measure as \"filmmaking by affirmative action,\" adding, \"it's totally daft, and it can't be done.\"  Despite the efforts to bring the Oscars closer to the current social climate, many in the film business have also questioned the divulging of such sensitive information but also whether moviemakers even care enough to adhere to the new standard considering the Academy Awards show broadcast's dismal ratings.   In 2019, when \"Parasite\" won best picture - the Academy Awards show had its second-smallest audience in history, delivering a 7.7 rating in adults 18-49 and 29.6 million viewers. That number was actually up 12% from 2018.  \"Instead of making it easier, they want to make it harder,\" one filmmaker said. \"And it's hard enough as it is to get movies made. People are just not going to do it.\"   Meanwhile, Rory Mir, a grassroots-advocacy organizer with the Electronic Frontier Foundation, an organization devoted to exploring privacy issues noted to Los Angeles magazine that \"data is a toxic asset,\" and \"any program that involves collecting data puts the collector at risk because it can be breached.\"  Under the future guidance, last year's best picture winner \"Nomadland\" would have been barred from contention due to its all-White cast, despite the fact it was directed by Chloe Zhao, an Asian filmmaker.   Additionally, this year's nominees including \"Power of the Dog,\" \"Belfast\" and \"Licorice Pizza\" could also see difficulty in receiving nomination while films such as \"King Richard,\" \"Drive My Car,\" \"Dune,\" \"West Side Story\" and \"Coda\" would have met the criterion for best picture consideration.  Ultimately, one producer wondered to the outlet: \"Is there any going back? I don't think so. I think the Oscars are dead.\"",
      Procent_Pozitiv: 0.3009953550709459,
      Word_Count: 595,
      RSSTag: "FOX News",
    }

    this.GetNewsByID = this.GetNewsByID.bind(this);
  }


  componentDidMount(){
    this.GetNewsByID();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.NewsID !== this.props.NewsID) {
      this.GetNewsByID();
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
        console.log(response);

        if (response.success == true) {
          this.setState({
            loding: false,
            success: true,
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

    let paragraphes = this.state.content.split("  ");



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

          <div className="ViewNewsSpace-Content" id="ViewNewsSpaceContent" RSSTag={this.state.RSSTag}>
            <InfiniteScroll
              dataLength={10}
              scrollableTarget="ViewNewsSpaceContent"

            >
              <div className="ViewNewsSpace-Content-SvgSpace">
                <a href={this.state.link} target="_blank" style={{ fill: fill }}><Svg></Svg></a>
              </div>
              <div className="ViewNewsSpace-Title">{this.state.title}</div>
              <div className="ViewNewsSpace-pubDate" style={{ color: fill }}>{this.state.pubDate}</div>
              <div className="ViewNewsSpace-Paragraphes">{paragraphes.map((i, index) => (
                <div className="ViewNewsSpace-Paragraph"> &emsp;{i}</div>
              ))}</div>
            </InfiniteScroll>



          </div>

        </div>
      )
    }
  }
}

export default ViewNewsPage;

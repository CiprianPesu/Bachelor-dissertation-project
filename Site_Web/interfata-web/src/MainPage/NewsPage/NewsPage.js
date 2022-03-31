import React from "react";
import "./NewsPage.css";
import { observer } from "mobx-react";
import InfiniteScroll from "react-infinite-scroll-component";
import Footer from "./Footer"
import Filter from "./FiltersSpace/Filter";
import CardsSpace from "./CardsSpace/CardSpace";


class NewsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            FiltersActive: "false",
            loading: false,

            items: [
                {
                    "id": "yLuAbX8BYr_j-SWxgAG4",
                    "title": "Ukraine claims Russian general has been killed in Kharkiv",
                    "description": "The Ukrainian defense ministry has claimed that a Russian general was killed in battle near Ukraine's second-largest city, Kharkiv.",
                    "pubDate": "2022-03-09 06:05:42",
                    "source": "CNN.com - RSS Channel - App International Edition",
                    "publication": "FOX News"
                },
                {
                    "id": "k7uAbX8BYr_j-SWxVgHA",
                    "title": "Ukraine: Ministers can now detain Russian planes in UK",
                    "description": "Flights linked to Russia are also criminalised in measures targeting figures close to the Kremlin.",
                    "pubDate": "2022-03-09 06:00:06",
                    "source": "BBC News - Home",
                    "publication": "CNN"
                },
                {
                    "id": "vLuAbX8BYr_j-SWxeAFt",
                    "title": "Sloppy England shocked by Windies at World Cup",
                    "description": "England engineer their own downfall in a damaging seven-run defeat by West Indies at the Women's World Cup in Dunedin.",
                    "pubDate": "2022-03-09 05:51:07",
                    "source": "BBC News - Home",
                    "publication": "FOX News"
                },
                {
                    "id": "47uAbX8BYr_j-SWxkwFn",
                    "title": "Ingraham blasts Joe Biden's 'disgustingly Washington' response to question on gas prices: 'it's vindictive'",
                    "description": "Laura Ingraham blasts Biden for lying that he cannot do anything to bring down the price of gas.",
                    "pubDate": "2022-03-09 05:45:39",
                    "source": "FOX News",
                    "publication": "CNN"
                },
                {
                    "id": "5LuAbX8BYr_j-SWxkwHQ",
                    "title": "Russia expert shreds Biden admin over no-fly zone: 'Dumb as a Siberian shoe'",
                    "description": "As the Biden administration considers how to deter further Russian aggression in Ukraine, a Russian expert is warning officials not to enact a no-fly zone.",
                    "pubDate": "2022-03-09 05:31:58",
                    "source": "FOX News",
                    "publication": "BBC"
                },
                {
                    "id": "yruAbX8BYr_j-SWxggFn",
                    "title": "News outlets make difficult and varying decisions to navigate Russia's new media law",
                    "description": "A version of this article first appeared in the \"Reliable Sources\" newsletter. You can sign up for free right here.",
                    "pubDate": "2022-03-09 05:16:24",
                    "source": "CNN.com - RSS Channel - App International Edition",
                    "publication": "CNN"
                },
                {
                    "id": "5buAbX8BYr_j-SWxlQEu",
                    "title": "Tulsi Gabbard: Washington's power elite want to turn Ukraine into another Afghanistan",
                    "description": "Tulsi Gabbard insists that this war is not in the best interests of the American people or the world.",
                    "pubDate": "2022-03-09 05:14:34",
                    "source": "FOX News",
                    "publication": "BBC"
                },
                {
                    "id": "5ruAbX8BYr_j-SWxlwEZ",
                    "title": "Zelenskyy is rallying 'the world,' Biden is leading from the 'rear': Rep. Michael Waltz",
                    "description": "Rep. Mike Waltz joins 'Hannity' along with former Trump Defense official Elbridge Colby, to discuss what the U.S. should have done earlier to help Ukraine.",
                    "pubDate": "2022-03-09 05:10:18",
                    "source": "FOX News",
                    "publication": "FOX News"
                },
                {
                    "id": "xruAbX8BYr_j-SWxfQGS",
                    "title": "Biden slams 'Putin's price hike' as high gas prices add to Democrats' woes ",
                    "description": "America's immediate political future will turn on this critical point: whether drivers stung by record gas prices blame Russian President Vladimir Putin or US President Joe Biden.",
                    "pubDate": "2022-03-09 05:05:56",
                    "source": "CNN.com - RSS Channel - App International Edition",
                    "publication": "CNN"
                },
                {
                    "id": "n7uAbX8BYr_j-SWxXwHZ",
                    "title": "The Papers: Zelensky channels Churchill and US-UK oil ban",
                    "description": "The Ukrainian president's address to the Commons and a ban on Russian oil imports dominate the papers.",
                    "pubDate": "2022-03-09 05:04:37",
                    "source": "BBC News - Home",
                    "publication": "FOX News"
                },
                {
                    "id": "57uAbX8BYr_j-SWxmQEp",
                    "title": "Florida Dunkin' employee who fatally punched customer, 77, over racial slur sentenced to house arrest",
                    "description": "A Dunkin' employee in Tampa, Florida, accused of fatally punching a customer who used a racial slur against him last year was sentenced to two years of house arrest after pleading guilty to felony battery.",
                    "pubDate": "2022-03-09 04:57:09",
                    "source": "FOX News",
                    "publication": "BBC"
                },
                {
                    "id": "6LuAbX8BYr_j-SWxmwEr",
                    "title": "UFC fighter says 'evil' has taken over America 'and we ain't afraid of it'",
                    "description": "UFC fighter Bryce Mitchell explains his stance on the Russia-Ukraine war and says that many of America's leaders are \"treasonous\" on \"Tucker Carlson Tonight.\"",
                    "pubDate": "2022-03-09 04:30:30",
                    "source": "FOX News",
                    "publication": "CNN"
                },
                {
                    "id": "6buAbX8BYr_j-SWxnwFH",
                    "title": "Tucker: Biden's response to the Russia-Ukraine war further proves he hates the middle class",
                    "description": "Fox News host Tucker Carlson reacts to Biden banning Russian oil and natural gas imports on 'Tucker Carlson Tonight.'",
                    "pubDate": "2022-03-09 04:18:02",
                    "source": "FOX News",
                    "publication": "CNN"
                },
                {
                    "id": "zbuAbX8BYr_j-SWxhAFS",
                    "title": "Russian-American charged with acting as illegal Russian agent in the US",
                    "description": "A dual Russian-American citizen has been charged with acting as a spy in the US, according to court filings that say she ran organizations that \"sought to spread Russian propaganda.\" ",
                    "pubDate": "2022-03-09 03:58:44",
                    "source": "CNN.com - RSS Channel - App International Edition",
                    "publication": "BBC"
                },
                {
                    "id": "6ruAbX8BYr_j-SWxowFF",
                    "title": "DC parent calls on mayor to 'unmask' kids after 'ignoring' school mask-wearing guidance",
                    "description": "Margot Athon calls it 'incredibly frustrating' that teachers unions are interfering in children's education.",
                    "pubDate": "2022-03-09 03:37:38",
                    "source": "FOX News",
                    "publication": "BBC"
                },
                {
                    "id": "67uAbX8BYr_j-SWxowHc",
                    "title": "Hannity: We are in deep 'Schiff' if Kamala Harris ever becomes president",
                    "description": "Fox News host Sean Hannity reprimanded Vice President Kamala Harris for encouraging Americans to purchase electric cars amid a surge in gas and oil prices.",
                    "pubDate": "2022-03-09 03:27:55",
                    "source": "FOX News",
                    "publication": "CNN"
                },
                {
                    "id": "brt6bX8BYr_j-SWx9AFe",
                    "title": "Women were once deemed too weak to work in Chinese restaurant kitchens. These chefs are proving doubters wrong ",
                    "description": "Archan Chan recalls her first experience working in a Chinese restaurant, more than 14 years ago. ",
                    "pubDate": "2022-03-09 03:24:00",
                    "source": "CNN.com - RSS Channel - App Travel Section",
                    "publication": "CNN"
                },
                {
                    "id": "7LuAbX8BYr_j-SWxpgHn",
                    "title": "Motorist allegedly plows into Polish embassy in DC amid tensions with Russia",
                    "description": "A motorist reportedly drove a car into the Polish embassy in Washington, D.C., on Tuesday night amid reports that the United States is sending two Patriot surface-to-air missile batteries to Poland amid tensions with Russia.",
                    "pubDate": "2022-03-09 03:15:14",
                    "source": "FOX News",
                    "publication": "BBC"
                },
                {
                    "id": "7buAbX8BYr_j-SWxrAEp",
                    "title": "Lindsey Graham believes Putin's 'ambition' is to recreate Soviet Union",
                    "description": "Sen. Lindsey Graham tells 'Jesse Watters Primetime' what he believes to be Putin's ultimate goals for Ukraine.",
                    "pubDate": "2022-03-09 03:13:08",
                    "source": "FOX News",
                    "publication": "BBC"
                },
                {
                    "id": "kLuAbX8BYr_j-SWxVQFk",
                    "title": "War in Ukraine: McDonald's, Coca-Cola and Starbucks halt Russian sales",
                    "description": "Western companies are turning their backs on Russia amid sanctions and violence in Ukraine.",
                    "pubDate": "2022-03-09 02:56:24",
                    "source": "BBC News - Home",
                    "publication": "BBC"
                },
                {
                    "id": "7ruAbX8BYr_j-SWxsQEm",
                    "title": "Jesse Watters shows how to 'restore American energy independence' amid record-high gas prices",
                    "description": "Jesse Watters proposed a pathway to American energy independence on 'Jesse Watters Primetime.'",
                    "pubDate": "2022-03-09 02:55:15",
                    "source": "FOX News",
                    "publication": "CNN"
                },
                {
                    "id": "z7uAbX8BYr_j-SWxhQFg",
                    "title": "Anxiety and uncertainty grow after basketball star Brittney Griner's arrest in Russia",
                    "description": "The arrest of two-time US Olympic basketball gold medalist Brittney Griner has left supporters anxious about her well-being and fearful that she might become a political pawn. ",
                    "pubDate": "2022-03-09 02:54:51",
                    "source": "CNN.com - RSS Channel - App International Edition",
                    "publication": "CNN"
                },
                {
                    "id": "77uAbX8BYr_j-SWxsgGU",
                    "title": "New Jersey dad tosses toddler son out a window to first responders in escape from burning building",
                    "description": "A New Jersey father had no choice but to throw his toddler son out of a second-story window to first responders below when a fire broke out in their apartment building Monday morning.",
                    "pubDate": "2022-03-09 02:48:37",
                    "source": "FOX News",
                    "publication": "BBC"
                },
                {
                    "id": "8LuAbX8BYr_j-SWxtQEt",
                    "title": "NPR correspondent: Political reaction to gas prices 'out of proportion' to actual economic impact",
                    "description": "NPR economics correspondent Scott Horsley maintained that while rising gas prices are bad politically, the public reaction is usually out of proportion to the actual impact on Americans.",
                    "pubDate": "2022-03-09 02:45:30",
                    "source": "FOX News",
                    "publication": "CNN"
                },
                {
                    "id": "zLuAbX8BYr_j-SWxgwFK",
                    "title": "Russian nationals 'stranded' in Thailand amid flight sanctions",
                    "description": "Thousands of tourists from Russia are currently stranded in Thailand, officials said on Tuesday, March 8, as unprecedented western sanctions over the invasion of Ukraine put a squeeze on Russians struggling to find flights and finances.",
                    "pubDate": "2022-03-09 02:33:30",
                    "source": "CNN.com - RSS Channel - App International Edition",
                    "publication": "CNN"
                }
            ],

            Filters: {
                Publications: [],
                WordsCount: [0, 0],
            },

            selectedFilters: {
                ItemsPerPage: 25,
                OrderBy: "leatest",
                Publications: [],
                WordsCount: [],
            },

            pageNr: 1,
            currentPage: 1,


        };
        this.goToNextPage = this.goToNextPage.bind(this);
        this.goToPrevPage = this.goToPrevPage.bind(this);
        this.changePage = this.changePage.bind(this);
        this.getNews = this.getNews.bind(this);
        this.getFiters = this.getFiters.bind(this);
        this.changeSelectedFilters = this.changeSelectedFilters.bind(this);

        this.getFiters();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.Searched !== this.props.Searched) {
            let oldSelectedFilters = this.state.selectedFilters
            delete oldSelectedFilters['Search']
            if (this.props.Searched !== "") {
                oldSelectedFilters["Search"] = this.props.Searched
            }
            this.setState({
                buttonDisable: true,
                currentPage: 1,
                items: [],
                loading: true,
            }, () => {
                this.getNews(oldSelectedFilters, 0)
            });
        }
    }


    toggleStateFiltersActive() {
        if (this.state.FiltersActive === "true") {
            this.setState({ FiltersActive: "false" })
        }
        else {
            this.setState({ FiltersActive: "true" })
        }
    }

    async getFiters() {
        try {
            let res = await fetch("/getFilters", {
                method: "post",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                }),
            });

            await res.json().then((result) => {
                if (result && result.success) {

                    let oldFilters = this.state.Filters;
                    let oldSelectedFilters = this.state.selectedFilters


                    oldFilters["Publications"] = result.Publications;
                    oldSelectedFilters["Publications"] = result.Publications;

                    oldFilters["WordsCount"] = result.WordsCount;
                    oldSelectedFilters["WordsCount"] = result.WordsCount;

                    console.log(oldFilters);

                    this.setState({
                        Filters: oldFilters,
                        selectedFilters: oldSelectedFilters,
                    });

                    this.getNews(oldSelectedFilters, 0);

                } else {
                    alert(result.msg);
                }
            });
        }
        catch (error) {
            this.setState({
            });
            console.log(error);
        };

    }


    changeSelectedFilters(FilterType, FilterName, FilterValue) {

        let curentFilters = this.state.selectedFilters;
        if (FilterType === "Select") {
            curentFilters[FilterName] = FilterValue;
        }
        else if (FilterType === "CheckBox") {
            if (curentFilters[FilterName].indexOf(FilterValue) > -1) {
                curentFilters[FilterName] = curentFilters[FilterName].filter(e => e !== FilterValue);
            }
            else {
                curentFilters[FilterName].push(FilterValue)
            }

            console.log(curentFilters[FilterName]);

        }
        else if (FilterType === "DoubleSlider") {
            curentFilters[FilterName] = FilterValue;
        }

        console.log(curentFilters);
        this.setState({ selectedFilters: curentFilters, loading: true });
        this.getNews(curentFilters, 0);
    }


    async getNews(filters, from) {
        try {
            let res = await fetch("/getNews", {
                method: "post",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    filters: filters,
                    from: from,
                }),
            });

            await res.json().then((result) => {
                if (result && result.success) {
                    var PageNr;

                    if (result.data.total_returns % filters.ItemsPerPage === 0) {
                        PageNr = result.data.total_returns / filters.ItemsPerPage;
                    }
                    else {
                        PageNr = Math.floor(result.data.total_returns / filters.ItemsPerPage) + 1;
                    }

                    if (PageNr > 99) {
                        PageNr = 99;
                    }
                    if (from == 0) {
                        this.setState({
                            currentPage: 1,
                        })
                    }


                    if (PageNr != this.state.pageNr) {

                        this.setState({
                            items: result.data.data,
                            pageNr: PageNr,
                            loading: false,
                        });
                    }
                    else {
                        this.setState({
                            items: result.data.data,
                            loading: false,
                        });

                    }

                } else {
                    this.setState({
                        loading: false,
                    });
                    alert(result.msg);
                }
            });
        }
        catch (error) {
            this.setState({
                loading: false,
            });
            console.log(error);
        };

    }


    changePage(event) {
        const pageNumber = Number(event.target.textContent);
        this.setState({
            currentPage: pageNumber,
            items: [],
            loading: true,
        }, () => {
            this.getNews(this.state.selectedFilters, (this.state.currentPage - 1) * this.state.selectedFilters.ItemsPerPage);
        });
    }

    goToNextPage() {

        if (this.state.currentPage != this.state.pageNr) {

            var old = this.state.currentPage + 1;
            this.setState({
                currentPage: old,
                items: [],
                loading: true,

            }, () => {
                this.getNews(this.state.selectedFilters, (this.state.currentPage - 1) * this.state.selectedFilters.ItemsPerPage);
            })
        }
    }

    goToPrevPage() {

        if (this.state.currentPage != 1) {
            this.setState({
                currentPage: this.state.currentPage - 1,
                items: [],
                loading: true,
            }, () => {
                this.getNews(this.state.selectedFilters, (this.state.currentPage - 1) * this.state.selectedFilters.ItemsPerPage)
            });
        }
    }

    render() {
        let filters = [
            {
                "Title": "Order by :",
                "Type": "Select",
                "Options": ["leatest", "earliest", "relevance"],
                "Default": "leatest",
                "FilterTarget": "OrderBy",
            },
            {
                "Title": "News per page :",
                "Type": "Select",
                "Options": [10, 25, 50, 100],
                "Default": 25,
                "FilterTarget": "ItemsPerPage",

            },
            {
                "Title": "Publications",
                "Type": "CheckBox",
                "Options": this.state.Filters.Publications,
                "Default": this.state.Filters.Publications,
                "FilterTarget": "Publications",
            },
            {
                "Title": "Word Count",
                "Type": "DoubleSlider",
                "Options": {
                    "Limits": this.state.Filters.WordsCount,
                },
                "FilterTarget": "WordsCount",
            },
        ]

        return (
            <div className="PageContent">
                <div className="Filter-Outer">
                    <div className="Filters-Space"  FiltersActive={this.state.FiltersActive}>
                        <div className="List" id="scrollableDivFilters">
                            <InfiniteScroll
                                dataLength={filters.length}
                                scrollableTarget="scrollableDivFilters"
                            >
                                <div className="FiltersSpace">
                                    {
                                        filters.map((i, index) => (
                                            <Filter
                                                callBack={this.changeSelectedFilters}
                                                key={index}
                                                Title={i["Title"]}
                                                Type={i["Type"]}
                                                Options={i["Options"]}
                                                Default={i["Default"]}
                                                FilterTarget={i["FilterTarget"]}
                                            ></Filter>
                                        ))}
                                </div>
                            </InfiniteScroll>
                        </div>
                    </div>
                </div>
                <div className="Filters-Space-Toggle" onClick={() => this.toggleStateFiltersActive()} >
                    <div className="Filters-Space-Toggle-spacer"></div>
                    <div className="Filters-Space-Toggle-Button">
                        <p>F</p>
                        <p>I</p>
                        <p>L</p>
                        <p>T</p>
                        <p>E</p>
                        <p>R</p>
                        <p>S</p>
                    </div>
                </div>

                <CardsSpace
                    loading={this.state.loading}
                    items={this.state.items}
                ></CardsSpace>

                <Footer
                    PageNr={this.state.pageNr}
                    currentPage={this.state.currentPage}
                    goToPrevPage={this.goToPrevPage}
                    goToNextPage={this.goToNextPage}
                    changePage={this.changePage}
                >
                </Footer>
            </div>
        );
    }

}

export default observer(NewsPage);
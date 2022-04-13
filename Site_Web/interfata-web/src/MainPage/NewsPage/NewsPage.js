import React from "react";
import "./NewsPage.css";
import { observer } from "mobx-react";
import InfiniteScroll from "react-infinite-scroll-component";
import Footer from "./Footer"
import Filter from "./FiltersSpace/Filter";
import CardsSpace from "./CardsSpace/CardSpace";
import { Navigate } from 'react-router-dom';


class NewsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            ToRedirect: "/",

            FiltersActive: "false",
            loading: true,

            items: [],

            Filters: {
                Publications: this.props.Publications,
                WordsCount: this.props.WordsCount,
                SentimentScore: this.props.SentimentScore,
            },

            selectedFilters: {
                ItemsPerPage: this.props.ItemsPerPage,
                Search: this.props.Searched,
                OrderBy: this.props.OrderBy,
                Publications: this.props.Publications,
                WordsCount: this.props.WordsCount,
                SentimentScore: this.props.SentimentScore,
            },

            pageNr: 1,
            currentPage: this.props.Page,
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
        if (this.state.redirect == true) {
            this.setState({ redirect: false, })
        }

        if (prevProps.Searched !== this.props.Searched) {
            let oldSelectedFilters = this.state.selectedFilters
            delete oldSelectedFilters['Search']

            if (this.props.Searched !== "") {
                oldSelectedFilters["Search"] = this.props.Searched
            }
            else {
                delete oldSelectedFilters.Search
            }
            this.setState({
                currentPage: 1,
                buttonDisable: true,
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
                    oldFilters["WordsCount"] = result.WordsCount;
                    oldFilters["SentimentScore"] = result.SentimentScore;


                    if (window.location.href.split("&").length == 1) {
                        oldSelectedFilters["WordsCount"] = result.WordsCount;
                        oldSelectedFilters["Publications"] = result.Publications;
                        oldSelectedFilters["SentimentScore"] = result.SentimentScore;
                    }

                    this.setState({
                        Filters: oldFilters,
                        selectedFilters: oldSelectedFilters,
                    });
                    this.getNews(oldSelectedFilters, (this.state.currentPage - 1) * oldSelectedFilters.ItemsPerPage);

                } else {
                    alert(result.msg);
                }
            });
        }
        catch (error) {
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
        }
        else if (FilterType === "DoubleSlider") {
            curentFilters[FilterName] = FilterValue;
        }

        let ToRedirect = "?"
        if ("Search" in curentFilters) {
            ToRedirect = ToRedirect + "Search=" + curentFilters.Search + "&"
        }


        ToRedirect = ToRedirect + "Publications=" + curentFilters.Publications + "&" +
            "OrderBy=" + curentFilters.OrderBy + "&" +
            "WordsCount=" + curentFilters.WordsCount + "&" +
            "SentimentScore=" + curentFilters.SentimentScore + "&" +
            "ItemsPerPage=" + curentFilters.ItemsPerPage + "&" +
            "page=" + this.state.currentPage


        this.setState({ selectedFilters: curentFilters, loading: true, ToRedirect: ToRedirect, redirect: true, })
        this.getNews(curentFilters, (this.state.currentPage - 1) * curentFilters.ItemsPerPage);
    }


    async getNews(filters, from) {
        try {

            if (filters.Search == "") {
                delete filters.Search
            }


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


        let ToRedirect = "?"
        if ("Search" in this.state.selectedFilters) {
            ToRedirect = ToRedirect + "Search=" + this.state.selectedFilters.Search + "&"
        }


        ToRedirect = ToRedirect + "Publications=" + this.state.selectedFilters.Publications + "&" +
            "OrderBy=" + this.state.selectedFilters.OrderBy + "&" +
            "WordsCount=" + this.state.selectedFilters.WordsCount + "&" +
            "SentimentScore=" + this.state.selectedFilters.SentimentScore + "&" +
            "ItemsPerPage=" + this.state.selectedFilters.ItemsPerPage + "&" +
            "page=" + pageNumber

        this.setState({
            ToRedirect: ToRedirect,
            redirect: true,
            currentPage: pageNumber,
            items: [],
            loading: true,
        }, () => {
            this.getNews(this.state.selectedFilters, (pageNumber - 1) * this.state.selectedFilters.ItemsPerPage);
        });
    }

    goToNextPage() {

        if (this.state.currentPage != this.state.pageNr) {


            var old = this.state.currentPage + 1;

            let ToRedirect = "?"
            if ("Search" in this.state.selectedFilters) {
                ToRedirect = ToRedirect + "Search=" + this.state.selectedFilters.Search + "&"
            }


            ToRedirect = ToRedirect + "Publications=" + this.state.selectedFilters.Publications + "&" +
                "OrderBy=" + this.state.selectedFilters.OrderBy + "&" +
                "WordsCount=" + this.state.selectedFilters.WordsCount + "&" +
                "SentimentScore=" + this.state.selectedFilters.SentimentScore + "&" +
                "ItemsPerPage=" + this.state.selectedFilters.ItemsPerPage + "&" +
                "page=" + old

            this.setState({
                ToRedirect: ToRedirect,
                redirect: true,
                currentPage: old,
                items: [],
                loading: true,

            }, () => {
                this.getNews(this.state.selectedFilters, (old - 1) * this.state.selectedFilters.ItemsPerPage);
            })
        }
    }

    goToPrevPage() {

        if (this.state.currentPage != 1) {

            var old = this.state.currentPage - 1;

            let ToRedirect = "?"
            if ("Search" in this.state.selectedFilters) {
                ToRedirect = ToRedirect + "Search=" + this.state.selectedFilters.Search + "&"
            }

            ToRedirect = ToRedirect + "Publications=" + this.state.selectedFilters.Publications + "&" +
                "OrderBy=" + this.state.selectedFilters.OrderBy + "&" +
                "WordsCount=" + this.state.selectedFilters.WordsCount + "&" +
                "SentimentScore=" + this.state.selectedFilters.SentimentScore + "&" +
                "ItemsPerPage=" + this.state.selectedFilters.ItemsPerPage + "&" +
                "page=" + old

            this.setState({
                ToRedirect: ToRedirect,
                redirect: true,
                currentPage: old,
                items: [],
                loading: true,
            }, () => {
                this.getNews(this.state.selectedFilters, (old - 1) * this.state.selectedFilters.ItemsPerPage)
            });
        }
    }

    render() {

        let filters = [
            {
                "Title": "Order by :",
                "Type": "Select",
                "Options": ["leatest", "earliest", "relevance"],
                "Default": this.props.OrderBy,
                "FilterTarget": "OrderBy",
            },
            {
                "Title": "News per page :",
                "Type": "Select",
                "Options": [10, 25, 50, 100],
                "Default": this.props.ItemsPerPage,
                "FilterTarget": "ItemsPerPage",

            },
            {
                "Title": "Publications",
                "Type": "CheckBox",
                "Options": this.state.Filters.Publications,
                "Default": this.state.selectedFilters.Publications,
                "FilterTarget": "Publications",
            },
            {
                "Title": "Word Count",
                "Type": "DoubleSlider",
                "Options": {
                    "Limits": this.state.Filters.WordsCount,
                    "Step":1,
                },
                "FilterTarget": "WordsCount",
            },
            {
                "Title": "Semtiment Score",
                "Type": "DoubleSlider",
                "Options": {
                    "Limits": this.state.Filters.SentimentScore,
                    "Step":0.01
                },
                "FilterTarget": "SentimentScore",
            },
        ]

        return (
            <div className="PageContent">
                <div className="Filter-Outer">
                    <div className="Filters-Space" FiltersActive={this.state.FiltersActive}>
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

                {this.state.redirect && <Navigate to={this.state.ToRedirect} replace={true} />}
            </div>
        );
    }

}

export default observer(NewsPage);
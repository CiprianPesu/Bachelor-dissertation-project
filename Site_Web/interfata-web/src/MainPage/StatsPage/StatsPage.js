import React from "react";
import "./StatsPage.css";
import { observer } from "mobx-react";
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

import {
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
} from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend, Title, BarElement, CategoryScale, LinearScale);

class StatsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            loading: true,
            success: false,
            newsCountPozitiveCNN: 300,
            newsCountPozitiveFOX: 200,
            newsCountPozitiveBBC: 100,

            newsCountNegativeCNN: 300,
            newsCountNegativeFOX: 200,
            newsCountNegativeBBC: 100,

            newsCountNeutralCNN: 300,
            newsCountNeutralFOX: 200,
            newsCountNeutralBBC: 100,

            avragePositivity: 0.54,
            avrageWordCount: 543.32,
        };

    }

    async componentDidMount() {
        try {
            let res = await fetch("/GetStats", {
                method: "post",
                Headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: {},
            });

            await res.json().then((response) => {
                

                if (response.success == true) {

                    let RSSTagsNewsCount = response.data.RSSTagsNewsCount;
                    
                    let newsCountPozitiveCNN = 0;
                    let newsCountPozitiveFOX = 0;
                    let newsCountPozitiveBBC = 0;

                    let newsCountNegativeCNN = 0;
                    let newsCountNegativeFOX = 0;
                    let newsCountNegativeBBC = 0;

                    let newsCountNeutralCNN = 0;
                    let newsCountNeutralFOX = 0;
                    let newsCountNeutralBBC = 0;
                    
                    for (let i = 0; i < RSSTagsNewsCount.length; i++) {
                        if (RSSTagsNewsCount[i].key == "CNN") {
                            newsCountPozitiveCNN = RSSTagsNewsCount[i].PozitivenewsCount.doc_count;
                            newsCountNegativeCNN = RSSTagsNewsCount[i].NegativenewsCount.doc_count;
                            newsCountNeutralCNN = RSSTagsNewsCount[i].NeutralnewsCount.doc_count;
                        }
                        if (RSSTagsNewsCount[i].key == "FOX News") {
                            newsCountPozitiveFOX = RSSTagsNewsCount[i].PozitivenewsCount.doc_count;
                            newsCountNegativeFOX = RSSTagsNewsCount[i].NegativenewsCount.doc_count;
                            newsCountNeutralFOX = RSSTagsNewsCount[i].NeutralnewsCount.doc_count;
                        }
                        if (RSSTagsNewsCount[i].key == "BBC") {
                            newsCountPozitiveBBC = RSSTagsNewsCount[i].PozitivenewsCount.doc_count;
                            newsCountNegativeBBC = RSSTagsNewsCount[i].NegativenewsCount.doc_count;
                            newsCountNeutralBBC = RSSTagsNewsCount[i].NeutralnewsCount.doc_count;
                        }
                    }



                    this.setState({
                        newsCountPozitiveCNN: newsCountPozitiveCNN,
                        newsCountPozitiveFOX: newsCountPozitiveFOX,
                        newsCountPozitiveBBC: newsCountPozitiveBBC,

                        newsCountNegativeCNN: newsCountNegativeCNN,
                        newsCountNegativeFOX: newsCountNegativeFOX,
                        newsCountNegativeBBC: newsCountNegativeBBC,

                        newsCountNeutralCNN: newsCountNeutralCNN,
                        newsCountNeutralFOX: newsCountNeutralFOX,
                        newsCountNeutralBBC: newsCountNeutralBBC,

                        avragePositivity: response.data.avragePositivity,
                        avrageWordCount: response.data.avrageWordCount,

                        success: true,
                        loading: false,
                    });
                }
                else {
                    this.setState({
                        loading: false,
                        success: false,
                    });
                }
            });
        } catch (error) {
            this.setState({
                loading: false,
                success: false,
            });
        }
    }


    render() {
        this.data_economii = {
            labels: ["BBC", "FOX News", "CNN"],
            datasets: [
                {
                    data: [
                        (this.state.newsCountPozitiveBBC + this.state.newsCountNegativeBBC + this.state.newsCountNeutralBBC),
                        this.state.newsCountPozitiveFOX + this.state.newsCountNegativeFOX + this.state.newsCountNeutralFOX,
                        this.state.newsCountPozitiveCNN + this.state.newsCountNegativeCNN + this.state.newsCountNeutralCNN,
                    ],
                    backgroundColor: [
                        "rgba(0, 0, 0, 0.95)",
                        "rgba(0,101 ,152, 0.95)",
                        "rgba(234,0 ,0, 0.95)",
                    ],
                    borderColor: [
                        "rgba(0, 0, 0, 1)",
                        "rgba(0,101 ,152, 1)",
                        "rgba(234,0 ,0, 1)",
                    ],
                    borderWidth: 1,
                },
            ],
        };

        const labels = ["BBC", "FOX News", "CNN"],

            data = {
                labels,
                datasets: [
                    {
                        label: 'Negative',
                        data: [this.state.newsCountNegativeBBC, this.state.newsCountNegativeFOX, this.state.newsCountNegativeCNN],
                        backgroundColor: 'rgb(200, 0, 0)',
                    },
                    {
                        label: 'Neutral',
                        data: [this.state.newsCountNeutralBBC, this.state.newsCountNeutralFOX, this.state.newsCountNeutralCNN],
                        backgroundColor: 'rgb(150, 150, 150)',
                    },
                    {
                        label: 'Pozitive',
                        data: [this.state.newsCountPozitiveBBC, this.state.newsCountPozitiveFOX, this.state.newsCountPozitiveCNN],
                        backgroundColor: 'rgb(0, 0, 132)',
                    },
                ],
            };

        return (
            <div className="statsPage">
                <div className="statsPage-content">
                    <div className="statsPage-content-Sources" style={{ width: "300px", hight: "300px" }}>
                        <h2>Sources</h2>
                        <Doughnut
                            data={this.data_economii}
                            options={{
                                legend: {
                                    display: true,
                                },
                                labels: {
                                    display: true,
                                    fontSize: 20,
                                    color: "black",
                                    FontWeight: "bolder",
                                },
                                tooltips: {
                                    enabled: true,
                                },

                            }}
                        />
                    </div>

                    <div className="statsPage-content-Sources" style={{ width: "500px", hight: "400px" }}>
                        <h2>Sentiment by source</h2>
                        <Bar data={data} width="500" height="300"
                            options={{
                                responsive: true,

                                scales: {
                                    x: {
                                        stacked: true,
                                    },
                                    y: {
                                        stacked: true,
                                    },
                                },
                                labels: {
                                    display: true,
                                    fontSize: 20,
                                    color: "black",
                                    FontWeight: "bolder",
                                },
                            }} />
                    </div>

                    <div className="statsPage-content-Average" style={{ width: "500px", hight: "400px" }}>
                        <h2>Averages</h2>
                        <div className="statsPage-content-Average-items" style={{ width: "400px", hight: "400px" }}>
                            <div>
                                <div className="statsPage-content-Average-item">
                                    Sentiment:
                                    <div className="statsPage-content-Average-item-value">
                                        {this.state.avragePositivity}
                                    </div>
                                </div>
                                <div className="statsPage-content-Average-item">
                                    Word Count:
                                    <div className="statsPage-content-Average-item-value">
                                        {this.state.avrageWordCount}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

    }
}

export default observer(StatsPage);

import React from 'react';
import { useSearchParams } from "react-router-dom";
import NewsPage from "./NewsPage"

function GetNewsPage() {

    const [searchParams] = useSearchParams();

    let Searched = "";
    let OrderBy = "leatest";
    let ItemsPerPage = 25;
    let WordsCount = [0, 0];
    let Publications = [];
    let Page = 1;

    for (const entry of searchParams.entries()) {
        if (entry[0] === "Search") {
            Searched = entry[1]
        }
        else if (entry[0] === "Publications") {
            if (entry[1] != "") {
                for (const i in entry[1].split(",")){
                    Publications.push(entry[1].split(",")[i])
                }
            }
        }
        else if (entry[0] === "OrderBy") {
            if (entry[1] != "") {
                OrderBy = entry[1]
            }

        }
        else if (entry[0] === "WordsCount") {
            if (entry[1] != "") {
                let counts=entry[1].split(',')
                WordsCount = [counts[0],counts[1]]
            }

        }
        else if (entry[0] === "ItemsPerPage") {
            if (entry[1] != "") {
                ItemsPerPage = entry[1]
            }
        }
        else if (entry[0] === "page") {
            if (entry[1] != "") {
                Page = parseInt(entry[1])
            }
        }
    }

    return (
        <NewsPage
            Page={Page}
            Searched={Searched}
            ItemsPerPage={ItemsPerPage}
            Publications={Publications}
            OrderBy={OrderBy}
            WordsCount={WordsCount}
        ></NewsPage>
    )
}

export default GetNewsPage;

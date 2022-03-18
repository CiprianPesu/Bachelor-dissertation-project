import React from "react";
import "./Footer.css";
import { observer } from "mobx-react";


class Footer extends React.Component {
    constructor(props) {
        super(props);
    }

    makeArr(startValue, stopValue) {
        var arr = [];
        for (var i = startValue; i<=stopValue; i++){
            arr.push(i);
        }  
        return arr;
      }

    render() {
        if(this.props.PageNr < 1 ){
            return (<div class="footer"></div>);
        }
        else if (this.props.PageNr < 11) {
            return (
                <div class="footer">
                    <button className="PrevButton" onClick={this.props.goToPrevPage} disabled={this.props.buttonDisable}>Prev</button>
                    {this.makeArr(1,this.props.PageNr).map((item, index) => (
                        <button
                            key={index}
                            onClick={this.props.changePage}
                            disabled={this.props.buttonDisable}
                            className={`paginationItem ${this.props.currentPage === item ? 'active' : null}`}
                        >
                            {item}
                        </button>
                    ))}
                    <button className="NextButton" onClick={this.props.goToNextPage} disabled={this.props.buttonDisable}>Next</button>
                </div>
            );
        }
        else {
            if (this.props.currentPage > 5 && this.props.currentPage < this.props.PageNr - 3) {
                return (

                    <div class="footer">
                        <button className="PrevButton" onClick={this.props.goToPrevPage} disabled={this.props.buttonDisable}>Prev</button>
                        {[1, 2, 3].map((item, index) => (
                            <button
                                key={index}
                                onClick={this.props.changePage}
                                disabled={this.props.buttonDisable}
                                className={`paginationItem ${this.props.currentPage === item ? 'active' : null}`}
                            >
                                {item}
                            </button>
                        ))}
                        <p className="Spacer">...</p>
                        {[this.props.currentPage - 1, this.props.currentPage, this.props.currentPage + 1].map((item, index) => (
                            <button
                                key={index}
                                onClick={this.props.changePage}
                                disabled={this.props.buttonDisable}
                                className={`paginationItem ${this.props.currentPage === item ? 'active' : null}`}
                            >
                                {item}
                            </button>
                        ))}
                        <p className="Spacer">...</p>
                        {[this.props.PageNr - 2, this.props.PageNr - 1, this.props.PageNr].map((item, index) => (
                            <button
                                key={index}
                                onClick={this.props.changePage}
                                disabled={this.props.buttonDisable}
                                className={`paginationItem ${this.props.currentPage === item ? 'active' : null}`}
                            >
                                {item}
                            </button>
                        ))}
                        <button className="NextButton" onClick={this.props.goToNextPage} disabled={this.props.buttonDisable}>Next</button>
                    </div>
                );
            }
            else if (this.props.currentPage < 6) {
                return (
                    <div class="footer">
                        <button className="PrevButton" onClick={this.props.goToPrevPage} disabled={this.props.buttonDisable}>Prev</button>
                        {[1, 2, 3, 4, 5, 6].map((item, index) => (
                            <button
                                key={index}
                                onClick={this.props.changePage}
                                disabled={this.props.buttonDisable}
                                className={`paginationItem ${this.props.currentPage == item ? 'active' : null}`}
                            >
                                {item}
                            </button>
                        ))}
                        <p className="Spacer">...</p>
                        {[this.props.PageNr - 2, this.props.PageNr - 1, this.props.PageNr].map((item, index) => (
                            <button
                                key={index}
                                onClick={this.props.changePage}
                                disabled={this.props.buttonDisable}
                                className={`paginationItem ${this.props.currentPage === item ? 'active' : null}`}
                            >
                                {item}
                            </button>
                        ))}
                        <button className="NextButton" onClick={this.props.goToNextPage} disabled={this.props.buttonDisable}>Next</button>
                    </div>
                );
            }
            else {
                return (
                    <div class="footer">
                        <button className="PrevButton" onClick={this.props.goToPrevPage} disabled={this.props.buttonDisable}>Prev</button>
                        {[1, 2, 3].map((item, index) => (
                            <button
                                key={index}
                                onClick={this.props.changePage}
                                disabled={this.props.buttonDisable}
                                className={`paginationItem ${this.props.currentPage === item ? 'active' : null}`}
                            >
                                {item}
                            </button>
                        ))}
                        <p className="Spacer">...</p>
                        {[this.props.PageNr - 4, this.props.PageNr - 3, this.props.PageNr - 2, this.props.PageNr - 1, this.props.PageNr].map((item, index) => (
                            <button
                                key={index}
                                onClick={this.props.changePage}
                                disabled={this.props.buttonDisable}
                                className={`paginationItem ${this.props.currentPage == item ? 'active' : null}`}
                            >
                                {item}
                            </button>
                        ))}
                        <button className="NextButton" onClick={this.props.goToNextPage} disabled={this.props.buttonDisable}>Next</button>
                    </div>
                );
            }
        }

    }
}

export default observer(Footer);
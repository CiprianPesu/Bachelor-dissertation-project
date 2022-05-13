import React from "react";

class Paragraf extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        let sentiment_value=parseFloat(this.props.sentiment).toPrecision(2)

        let color="gray"
        if(sentiment_value>=0.7){
            color="rgba(0,0,255,"+(0.1+((sentiment_value-0.7)*3))+")";
        }
        else if(sentiment_value<=0.3){
            color="rgba(255,0,0,"+(0.1+(0.3-sentiment_value)*3)+")";
        }
        else{
            color="gray";
        }


        return(
            <div className="ViewNewsSpace-Paragraph">
                <div className="ViewNewsSpace-Paragraph-Color" style={{background:color,marginRight:"10px"}}>
                    {parseInt(parseFloat(this.props.sentiment)*100).toString()+"%"}
                </div>
                <div className="ViewNewsSpace-Paragraph-Text">&emsp;&emsp;{this.props.Paragraf}</div>
            </div>)
    }
}

export default Paragraf;
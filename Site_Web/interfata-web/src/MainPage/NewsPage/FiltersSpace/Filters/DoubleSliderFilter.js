
import React from "react";
import { ReactComponent as ChevronIcon } from "../../../../icons/caret.svg";
import { IconButton, Slider, TextField } from '@mui/material/';
import { styled } from '@mui/material/styles';

const CostumeSlider = styled(Slider)(({ theme }) => ({
    color: 'rgb(81, 81, 81)',
    height: 3,
    display: "flex",
    justifyContent: "flex-end",
    padding: '20px 0',
    '& .MuiSlider-thumb': {
        height: 20,
        width: 20,
        backgroundColor: '#285279',
        border: '1px solid currentColor',
        '&:hover': {
            boxShadow: '1 1 1 8px rgba(58, 133, 137, 0.16)',
        },
        '& .airbnb-bar': {
            height: 9,
            width: 1,
            backgroundColor: 'currentColor',
            marginLeft: 1,
            marginRight: 1,
        },
    },
}));



class DoubleSliderFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeMenu: "false",
            value: this.props.Limits,
            OldValues: this.props.Limits,
        };
    }

    handleChangeRelease = (event, newValue) => {
        this.props.callBack(this.props.Type,this.props.FilterTarget, newValue);
    };

    toggleState() {

        if((this.state.value[0] === 0) && (this.state.value[1]===0)){
            this.setState({
                value:this.props.Limits,
            })
        }
        

        if (this.state.activeMenu === "true") {
            this.setState({ activeMenu: "false" })
        }
        else {
            this.setState({ activeMenu: "true" })
        }
    }


    handleChange = (event, newValue) => {
        if((this.state.value[0] === 0) && (this.state.value[1]===0)){
            this.setState({
                value:this.props.Limits,
            })
        }

        if (newValue[0] < newValue[1]) {
            this.setState({ value: newValue });
        }
        else {
            let aux = newValue[1];
            newValue[1] = newValue[0];
            newValue[0] = aux;
            this.setState({ value: newValue });
        }

        this.setState({ OldValues: this.state.value })
    };

    changeHandleData0 = e => {
        if ((this.props.Limits[1] >= e.target.value) && (this.props.Limits[0] <= e.target.value)) {
            this.setState({ value: [e.target.value, this.state.value[1]] })
        }

    }

    changeHandleData1 = e => {
        if ((this.props.Limits[1] >= e.target.value) && (this.props.Limits[0] <= e.target.value)) {
            this.setState({ value: [this.state.value[0], e.target.value] })
        }
    }


    changeHandleDataRelease0 = e => {
        if ((this.props.Limits[1] >= e.target.value) && (this.props.Limits[0] <= e.target.value)) {
            if (e.target.value <= this.state.OldValues[1]) {
                this.setState({
                    value: [parseInt(e.target.value), parseInt(this.state.OldValues[1])],
                    OldValues: [parseInt(e.target.value), parseInt(this.state.OldValues[1])]
                })
                this.props.callBack(this.props.Type,this.props.FilterTarget, [parseInt(e.target.value), parseInt(this.state.OldValues[1])]);
            }
            else {
                this.setState({
                    value: [parseInt(this.state.OldValues[1]), parseInt(e.target.value)],
                    OldValues: [parseInt(this.state.OldValues[1]), parseInt(e.target.value)],
                })
                this.props.callBack(this.props.Type,this.props.FilterTarget, [parseInt(this.state.OldValues[1]), parseInt(e.target.value)]);
            }
        }
        else {
            this.setState({ value: this.state.OldValues })
        }
    }

    changeHandleDataRelease1 = e => {
        if ((this.props.Limits[1] >= e.target.value) && (this.props.Limits[0] <= e.target.value)) {
            if (e.target.value >= this.state.OldValues[0]) {
                this.setState({
                    value: [parseInt(this.state.OldValues[0]), parseInt(e.target.value)],
                    OldValues: [parseInt(this.state.OldValues[0]), parseInt(e.target.value)],
                })
                this.props.callBack(this.props.Type,this.props.FilterTarget, [parseInt(this.state.OldValues[0]), parseInt(e.target.value)]);
            }
            else {
                this.setState({
                    value: [parseInt(e.target.value), parseInt(this.state.OldValues[0])],
                    OldValues: [parseInt(e.target.value), parseInt(this.state.OldValues[0])],
                })
                this.props.callBack(this.props.Type,this.props.FilterTarget, [parseInt(e.target.value), parseInt(this.state.OldValues[0])]);
            }

        }
        else {
            this.setState({ value: this.state.OldValues })
        }
    }


    render() {
        return (
            <div className="OuterFilter">
                <div className="FilterTitle" onClick={() => this.toggleState()}>{this.props.Title}
                    <div className="FilterTitle-button">
                        <IconButton> <ChevronIcon></ChevronIcon></IconButton>
                    </div>
                </div>
                <div className="FilterContent" active={this.state.activeMenu}>
                    <div className="SliderSpace">
                        <CostumeSlider
                            getAriaLabel={() => 'Temperature range'}
                            value={this.state.value}
                            onChange={this.handleChange}
                            onChangeCommitted={this.handleChangeRelease}
                            valueLabelDisplay="off"
                            max={this.props.Limits[1]}
                            min={this.props.Limits[0]}
                            step={this.props.Step}
                        />
                        <div className="TextFiledsSpace">
                            <TextField
                                value={this.state.value[0]}
                                onChange={this.changeHandleData0}
                                onBlur={this.changeHandleDataRelease0}
                                size="small"
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            ></TextField>
                            <div className="Spacer"></div>
                            <p>-</p>
                            <div className="Spacer"></div>
                            <TextField
                                value={this.state.value[1]}
                                onChange={this.changeHandleData1}
                                onBlur={this.changeHandleDataRelease1}
                                size="small"
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            ></TextField>
                        </div>
                    </div>
                </div>
            </div>)
    }
}

export default DoubleSliderFilter;
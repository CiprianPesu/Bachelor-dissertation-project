import { Checkbox } from "@mui/material";
import React from "react";
import { ReactComponent as ChevronIcon } from "../../../../icons/caret.svg";

import { FormControl, FormControlLabel, IconButton, FormGroup } from '@mui/material/';

class CheckBoxFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeMenu: "false",
        };
    }

    handleChange = (event) => {
        this.props.callBack(this.props.Type,this.props.FilterTarget, event.target.value);
    };


    toggleState() {
        if (this.state.activeMenu === "true") {
            this.setState({ activeMenu: "false" })
        }
        else {
            this.setState({ activeMenu: "true" })
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
                    <FormControl component="fieldset">
                        <FormGroup aria-label="position">
                            {this.props.Options.map((i, index) => (

                                <FormControlLabel
                                    key={index}
                                    value={i}
                                    control={<Checkbox sx={{
                                        '&.Mui-checked': {
                                            //color: "#74aa9d",
                                            color:"#285279",
                                        },
                                    }
                                }
                                    checked={this.props.Default.includes(i)}
                                    onChange={this.handleChange} />}
                                    label={i}
                                />
                            ))}
                        </FormGroup>
                    </FormControl>
                </div>
            </div>)
    }
}

export default CheckBoxFilter;
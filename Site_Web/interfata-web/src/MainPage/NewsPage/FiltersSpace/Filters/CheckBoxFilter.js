import { Checkbox } from "@mui/material";
import React from "react";
import { ReactComponent as ChevronIcon } from "../../../../icons/caret.svg";

import { FormControl, FormControlLabel, IconButton, FormGroup } from '@mui/material/';

class CheckBoxFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeMenu: "false",

            ID: props.ID,
            Title: props.Title,
            Type: props.Type,
            Options: props.Options,
            value: "",
        };
    }

    handleChange = (event) => {
        this.props.callBack(event.target.value, event.target.checked);
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
                <div className="FilterTitle" onClick={() => this.toggleState()}>{this.state.Title}
                    <div className="FilterTitle-button">
                        <IconButton> <ChevronIcon></ChevronIcon></IconButton>
                    </div>

                </div>
                <div className="FilterContent" active={this.state.activeMenu}>
                    <FormControl component="fieldset">
                        <FormGroup aria-label="position">
                            {this.state.Options.map((i, index) => (

                                <FormControlLabel
                                    key={index}
                                    value={i}
                                    control={<Checkbox sx={{
                                        '&.Mui-checked': {
                                            color: "#74aa9d",
                                        }, 
                                    }}
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
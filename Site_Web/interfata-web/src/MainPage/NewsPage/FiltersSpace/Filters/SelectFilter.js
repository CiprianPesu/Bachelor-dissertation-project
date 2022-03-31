
import React from "react";
import { FormControl, InputLabel, NativeSelect, InputBase } from '@mui/material/';
import { styled } from '@mui/material/styles';


const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
        marginTop: theme.spacing(3),
        fontSize: "14px",
    },
    
    '& .MuiInputBase-input': {
        borderRadius: 5,
        position: 'relative',
        backgroundColor: "transparent",
        border: '2px solid #000',
        textAlign: "center",
        "vertical-align":"baseline",
        fontSize: 18,
        "min-width":"fit-content",
        padding:"0px",
        margin:"0",
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        '&:focus': {
            borderRadius: 4,
            borderColor: 'rgb(40, 82, 121)',
            boxShadow: '0 0 0 0.2rem rgba(40, 82, 121,.25)',
        },
    },
}));


class SelectFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeMenu: "false",
            value: "",
        };
    }
    handleChange = (event) => {
        this.props.callBack(this.props.Type,this.props.FilterTarget , event.target.value);
    };

    render() {
        return (
            <div className="OuterFilter">
                <div className="FilterTitle">{this.props.Title}
                    <div className="Spacer"></div>
                    <div>
                        <FormControl fullWidth>
                            <NativeSelect
                                defaultValue={this.props.Default}
                                onChange={this.handleChange}
                                input={<BootstrapInput />}
                            >
                                {this.props.Options.map((i, index) => (
                                    <option value={i}>{i}</option>
                                ))}
                            </NativeSelect>
                        </FormControl>
                    </div>


                </div>

            </div>)
    }
}

export default SelectFilter;
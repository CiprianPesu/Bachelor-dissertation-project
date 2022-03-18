
import React from "react";
import { FormControl, InputLabel, NativeSelect, InputBase } from '@mui/material/';
import { styled } from '@mui/material/styles';


const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
        marginTop: theme.spacing(3),
        fontSize: "10px",
    },
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: "transparent",
        border: '2px solid #000',
        fontSize: 18,
        padding: '0',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#74aa9d',
            boxShadow: '0 0 0 0.2rem rgba(116, 170, 157,.25)',
        },
    },
}));


class SelectFilter extends React.Component {
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



    render() {
        return (
            <div className="OuterFilter">
                <div className="FilterTitle">{this.state.Title}
                    <div className="Spacer"></div>
                    <div>
                        <FormControl fullWidth>
                            <NativeSelect
                                defaultValue={30}
                                input={<BootstrapInput />}
                            >
                                {this.state.Options.map((i, index) => (
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
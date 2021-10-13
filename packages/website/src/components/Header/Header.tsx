import './Header.scss';
import {Box, Grid, makeStyles} from "@material-ui/core";
import Logo from "../Logo/Logo";
import React from "react";
import {Email} from "@material-ui/icons";
import {getCommonStyles} from "../../utils/styles";

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme)
    };
});

function Header(): JSX.Element {
    const classes = useStyles();
    return (<div className={"header-wrapper"}>
        <div className={"header-container"}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={1} md={1} lg={1} xl={1}></Grid>
                <Grid item xs={12} sm={10} md={10} lg={10} xl={10}>
                    <Box display="flex" p={1} alignItems="flex-start">
                        <Box p={1} flexGrow={1}>
                            <div className={"logo "}>
                                <Logo></Logo>
                            </div>
                        </Box>
                        <Box p={1}>
                            <div>
                                <div className={"anchor " + classes.primaryBorder} onClick={() => {
                                    window.open("mailto:hello@algodesk.io", "_blank");
                                }}>
                                    <Email color={"primary"}></Email>
                                    hello@algodesk.io
                                </div>
                            </div>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </div>
    </div>);
}

export default Header;

import './Header.scss';
import {Box, Button, Grid} from "@material-ui/core";
import Logo from "../Logo/Logo";
import React from "react";
import {Email} from "@material-ui/icons";

function Header(): JSX.Element {
    return (<div className={"header-wrapper"}>
        <div className={"header-container"}>
            <Grid container spacing={2}>
                <Grid item xs={1} sm={2} md={2} lg={2} xl={2}>
                </Grid>
                <Grid item xs={10} sm={8} md={8} lg={8} xl={8}>
                    <Box display="flex" p={1} alignItems="flex-start">
                        <Box p={1} flexGrow={1}>
                            <div className={"logo "}>
                                <Logo></Logo>
                            </div>
                        </Box>
                        <Box p={1}>
                            <div>
                                <Button color={"primary"}
                                        startIcon={<Email></Email>}
                                        variant={"outlined"}
                                        size={"small"}
                                        onClick={() => {
                                            window.open("mailto:hello@algodesk.io", "_blank");
                                        }}
                                >hello@algodesk.io</Button>
                            </div>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={1} sm={2} md={2} lg={2} xl={2}>
                </Grid>
            </Grid>
        </div>
    </div>);
}

export default Header;

import './Body.scss';
import React from "react";
import {Grid, makeStyles} from "@material-ui/core";
import {ArrowRightAlt, Twitter} from "@material-ui/icons";
import pageGif from '../../assets/images/page-gif.png';
import {CustomButton} from '../../utils/theme';
import {getCommonStyles} from "../../utils/styles";

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme)
    };
});

function Body(): JSX.Element {
    const classes = useStyles();

    return (<div className={"body-wrapper"}>
        <div className={"body-container"}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={1} md={1} lg={1} xl={1}></Grid>
                <Grid item xs={12} sm={10} md={10} lg={10} xl={10}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={5} md={5} lg={5} xl={5}>
                            <div className={"anchor " + classes.primaryBorder}>
                                <div className="title">
                                    Layer-1 Assets
                                </div>
                                <div className="subtitle">
                                    Create, Configure and Manage your Assets on Algorand Blockchain
                                </div>
                            </div>
                            <div className="open-app">
                                <CustomButton color={"primary"}
                                        startIcon={<Twitter color={"primary"}></Twitter>}
                                        variant={"outlined"}
                                        size={"large"}
                                        style={{marginRight: 20, color: '#000'}}
                                        onClick={() => {
                                            window.open("https://twitter.com/algodeskio", "_blank");
                                        }}
                                >Twitter</CustomButton>

                                <CustomButton color={"primary"}
                                        className="open-app-button"
                                        endIcon={<ArrowRightAlt></ArrowRightAlt>}
                                        variant={"contained"} size={"large"}
                                        onClick={() => {
                                            window.open("https://app.algodesk.io", "_blank");
                                        }}
                                >Open Application</CustomButton>

                            </div>
                        </Grid>
                        <Grid item xs={12} sm={1} md={1} lg={1} xl={1}></Grid>
                        <Grid item xs={12} sm={5} md={5} lg={5} xl={5}>
                            <div className="page-gif">
                                <img alt="background" src={pageGif} />
                            </div>
                        </Grid>
                    </Grid>

                </Grid>
            </Grid>

        </div>
    </div>);
}

export default Body;

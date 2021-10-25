import './Body.scss';
import React from "react";
import {Button, Grid, makeStyles, Slide} from "@material-ui/core";
import {ArrowRightAlt, Twitter, CheckCircleOutlined} from "@material-ui/icons";
import pageGif from '../../assets/images/page-gif.png';
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
                <Grid item xs={12} sm={2} md={2} lg={2} xl={2}></Grid>
                <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <div className={"anchor " + classes.primaryBorder}>
                                <div className="title">
                                    Layer-1 Assets
                                </div>
                                <div className="subtitle">
                                    Create, Configure and Manage your Assets on Algorand Blockchain
                                </div>
                            </div>
                            <div className="bullets">
                                <div className={"bullet " + classes.primaryText}>
                                    <span>
                                        <CheckCircleOutlined color={"primary"}></CheckCircleOutlined>
                                    </span>
                                    Transaction Speed: 4 Seconds
                                </div>
                                <div className={"bullet " + classes.primaryText}>
                                    <span>
                                        <CheckCircleOutlined color={"primary"}></CheckCircleOutlined>
                                    </span>
                                    Instant finality
                                </div>
                                <div className={"bullet " + classes.primaryText}>
                                    <span>
                                        <CheckCircleOutlined color={"primary"}></CheckCircleOutlined>
                                    </span>
                                    Transaction Cost: 0.001 Algo
                                </div>
                                <div className={"bullet " + classes.primaryText}>
                                    <span>
                                        <CheckCircleOutlined color={"primary"}></CheckCircleOutlined>
                                    </span>
                                    Unforkable blockchain
                                </div>
                            </div>

                            <div className="open-app">
                                <Button color={"primary"}
                                        startIcon={<Twitter color={"primary"}></Twitter>}
                                        variant={"outlined"}
                                        size={"large"}
                                        style={{marginRight: 20, color: '#000'}}
                                        onClick={() => {
                                            window.open("https://twitter.com/algodeskio", "_blank");
                                        }}
                                >Twitter</Button>

                                <Button color={"primary"}
                                        className="open-app-button"
                                        endIcon={<ArrowRightAlt></ArrowRightAlt>}
                                        variant={"contained"} size={"large"}
                                        onClick={() => {
                                            window.open("https://app.algodesk.io", "_blank");
                                        }}
                                >Open Application</Button>

                            </div>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Slide in={true} direction={"down"}>
                                <div className="page-gif">
                                    <img alt="background" src={pageGif} />
                                </div>
                            </Slide>

                        </Grid>
                    </Grid>

                </Grid>
            </Grid>

        </div>
    </div>);
}

export default Body;

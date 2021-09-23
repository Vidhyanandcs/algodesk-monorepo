import './Body.scss';
import React from "react";
import {Button, Grid} from "@material-ui/core";
import {ArrowRightAlt, Twitter} from "@material-ui/icons";
import background from '../../assets/images/hero-img.png';

function Body(): JSX.Element {
    return (<div className={"body-wrapper"}>
        <div className={"body-container"}>
            <Grid container spacing={2}>
                <Grid item xs={1} sm={2} md={2} lg={2} xl={2}>
                </Grid>
                <Grid item xs={10} sm={8} md={8} lg={8} xl={8}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            <div className="title">
                                Layer-1 Assets
                            </div>
                            <div className="subtitle">
                                Create, Configure and Manage your Assets on Algorand Blockchain
                            </div>

                            <div className="open-app">
                                <Button color={"primary"}
                                        startIcon={<Twitter></Twitter>}
                                        variant={"outlined"}
                                        size={"large"}
                                        style={{marginRight: 20}}
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
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            {/*<img alt="background" src="https://bootstrapmade.com/demo/templates/FlexStart/assets/img/hero-img.png"/>*/}
                            <img alt="background" src={background}/>
                        </Grid>
                    </Grid>

                </Grid>
                <Grid item xs={1} sm={2} md={2} lg={2} xl={2}>
                </Grid>
            </Grid>

        </div>
    </div>);
}

export default Body;

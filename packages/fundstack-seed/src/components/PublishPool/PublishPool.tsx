import './PublishPool.scss';
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    IconButton, makeStyles
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {CancelOutlined, CheckCircle} from "@material-ui/icons";
import React from "react";
import {getCommonStyles} from "../../utils/styles";
import {publish, setAction} from "../../redux/actions/pool";
import {globalStateKeys} from "@fundstack/sdk";
import {microalgosToAlgos} from "algosdk";
import {Alert} from "@material-ui/lab";

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        customDialog: {
            position: "absolute",
            top: 30
        }
    };
});

function PublishPool(): JSX.Element {

    const dispatch = useDispatch();

    const poolDetails = useSelector((state: RootState) => state.pool);
    const show = poolDetails.action === 'publish';
    const {pool} = poolDetails;
    const classes = useStyles();
    

    return (<div>
        {show ? <Dialog
            fullWidth={true}
            maxWidth={"xs"}
            open={show}
            classes={{
                paper: classes.customDialog
            }}
        >
            <DialogTitle >
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div>

                    </div>
                    <IconButton color="primary" onClick={() => {
                        dispatch(setAction(''));
                    }}>
                        <CancelOutlined />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent>
                <div className="publish-pool-wrapper">
                    <div className="publish-pool-container">
                        <div className="pricing">
                            <header>Pricing</header>
                            <div className="item">
                                <div className={classes.primaryText + ' value'}>
                                    <CheckCircle></CheckCircle>
                                    Platform base fee <span> = {microalgosToAlgos(pool.globalState[globalStateKeys.platform_publish_fee])} Algo</span>
                                </div>
                                <div className="text">
                                    Platform Base fee for creating pool on our platform. Charged while publishing your pool.
                                </div>
                            </div>
                            <div className="item">
                                <div className={classes.primaryText + ' value'}>
                                    <CheckCircle></CheckCircle>
                                    Platform success fee <span> = {pool.globalState[globalStateKeys.platform_success_fee]} %</span>
                                </div>
                                <div className="text">
                                    Platform success fee. {pool.globalState[globalStateKeys.platform_success_fee]} % of total amount raised is charged by the platform. Charged up on successful completion.
                                </div>
                            </div>
                            <div className="item">
                                <div className={classes.primaryText + ' value'}>
                                    <CheckCircle></CheckCircle>
                                    Investor registration fee <span> = {microalgosToAlgos(pool.globalState[globalStateKeys.platform_registration_fee])} Algo</span>
                                </div>
                                <div className="text">
                                    Platform investor registration fee. Charged for the investors while registering for your pool.
                                </div>
                            </div>

                            <Alert severity={"warning"} style={{borderRadius: 10}} icon={false}>Please be aware that there is a success criteria of {pool.globalState[globalStateKeys.platform_success_criteria_percentage]}%. If {pool.globalState[globalStateKeys.platform_success_criteria_percentage]}% of pool assets are not sold then it is considered as a failed attempt to raise funds. In that case you will be able to withdraw your assets from pool and investors will be able to withdraw their investment amount. In any case platform base fee is not refundable.</Alert>

                            <div className="item">
                                <Button
                                    fullWidth
                                    color={"primary"}
                                    variant={"contained"}
                                    size={"large"}
                                    className="custom-button"
                                    onClick={async () => {
                                        dispatch(publish(Number(pool.id)));
                                    }}
                                >Agree & publish</Button>
                            </div>

                        </div>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>

            </DialogActions>
        </Dialog> : ''}
    </div>);
}

export default PublishPool;

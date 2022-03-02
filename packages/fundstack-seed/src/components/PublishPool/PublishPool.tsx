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

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        customDialog: {
            position: "absolute",
            top: 100
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
                            <header className={classes.primaryText}>Pricing</header>
                            <div className="item">
                                <div className={classes.primaryText + ' value'}>
                                    <CheckCircle></CheckCircle>
                                    {microalgosToAlgos(pool.globalState[globalStateKeys.platform_publish_fee])} Algo
                                </div>
                                <div className="text">
                                    Platform Base fee for creating pool on our platform. Charged while publishing your pool.
                                </div>
                            </div>
                            <div className="item">
                                <div className={classes.primaryText + ' value'}>
                                    <CheckCircle></CheckCircle>
                                    {pool.globalState[globalStateKeys.platform_success_fee]} %
                                </div>
                                <div className="text">
                                    Platform success fee. {pool.globalState[globalStateKeys.platform_success_fee]} % of total amount raised is charged by the platform. Charged up on successful completion.
                                </div>
                            </div>
                            <div className="item">
                                <div className={classes.primaryText + ' value'}>
                                    <CheckCircle></CheckCircle>
                                    {microalgosToAlgos(pool.globalState[globalStateKeys.platform_registration_fee])} Algo
                                </div>
                                <div className="text">
                                    Platform user registration fee. Charged for the investors while registering for your pool.
                                </div>
                            </div>

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

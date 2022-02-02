import './PublishFund.scss';
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
import {publish, setAction} from "../../redux/actions/fund";
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

function PublishFund(): JSX.Element {

    const dispatch = useDispatch();

    const fund = useSelector((state: RootState) => state.fund);
    const show = fund.action === 'publish';
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
                <div className="publish-fund-wrapper">
                    <div className="publish-fund-container">
                        <div className="pricing">
                            <header className={classes.primaryText}>Pricing</header>
                            <div className="item">
                                <div className={classes.primaryText + ' value'}>
                                    <CheckCircle></CheckCircle>
                                    {microalgosToAlgos(fund.fund.globalState[globalStateKeys.platform_publish_fee])} Algo
                                </div>
                                <div className="text">
                                    Platform Base fee for deploying your project on fundstack. This is non-refundable. Charged while publishing your project.
                                </div>
                            </div>
                            <div className="item">
                                <div className={classes.primaryText + ' value'}>
                                    <CheckCircle></CheckCircle>
                                    {fund.fund.globalState[globalStateKeys.platform_success_fee]} %
                                </div>
                                <div className="text">
                                    Platform success fee. {fund.fund.globalState[globalStateKeys.platform_success_fee]} % of total funds raised as part of your fundraising is charged by the platform. Charged up on successful fundraising.
                                </div>
                            </div>
                            <div className="item">
                                <div className={classes.primaryText + ' value'}>
                                    <CheckCircle></CheckCircle>
                                    {microalgosToAlgos(fund.fund.globalState[globalStateKeys.platform_registration_fee])} Algo
                                </div>
                                <div className="text">
                                    Platform user registration fee. Charged for the investors while registering for your project.
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
                                        dispatch(publish(Number(fund.fund.id)));
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

export default PublishFund;

import './Settings.scss';
import {FormControl, FormControlLabel, FormLabel, makeStyles, Radio, RadioGroup} from "@material-ui/core";
import {useState} from "react";
import {getNetwork, setNetwork as selectNetwork} from "../../utils/network";
import {RootState} from "../../redux/store";
import {hideSettings} from "../../redux/actions/settings";
import {Dialog, DialogActions, DialogContent, DialogTitle, IconButton} from "@material-ui/core";
import {Close} from '@material-ui/icons';
import {useDispatch, useSelector} from "react-redux";
import {commonStyles} from "../../utils/styles";

const useStyles = makeStyles({
    ...commonStyles,
    customDialog: {
        position: "absolute",
        top: 100
    }
});

function Settings(): JSX.Element {
    const [network, setNetwork] = useState(getNetwork());

    const settings = useSelector((state: RootState) => state.settings);
    const dispatch = useDispatch();
    const classes = useStyles();

    return (<div>
        {settings.show ? <Dialog
            fullWidth={true}
            maxWidth={"xs"}
            open={settings.show}
            classes={{
                paper: classes.customDialog
            }}
        >
            <DialogTitle >
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{paddingTop: 7}}>Settings</div>
                    <IconButton color="default" onClick={() => {
                        dispatch(hideSettings())
                    }}>
                        <Close />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent>
                <div className="settings-wrapper">
                    <div className="settings-container">
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Select network</FormLabel>
                            <RadioGroup row value={network} onChange={(ev) => {
                                const network = ev.target.value;
                                setNetwork(network);
                                selectNetwork(network);
                            }}>
                                <FormControlLabel value="testnet" control={<Radio color="primary"/>} label="TestNet" />
                                <FormControlLabel value="betanet" control={<Radio color="primary"/>} label="BetaNet" />
                                <FormControlLabel value="mainnet" control={<Radio color="primary"/>} label="MainNet" />
                            </RadioGroup>
                        </FormControl>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
            </DialogActions>
        </Dialog> : ''}
    </div>);
}

export default Settings;

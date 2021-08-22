import './Settings.scss';
import {FormControl, FormControlLabel, FormLabel, makeStyles, Radio, RadioGroup} from "@material-ui/core";
import {useState} from "react";
import {RootState} from "../../redux/store";
import {hideSettings} from "../../redux/actions/settings";
import {setNetwork as setNetworkAction} from "../../redux/actions/network";
import {Dialog, DialogActions, DialogContent, DialogTitle, IconButton} from "@material-ui/core";
import {Close} from '@material-ui/icons';
import {useDispatch, useSelector} from "react-redux";
import {getCommonStyles} from "../../utils/styles";
import {NETWORKS, getNetworks} from '@algodesk/core';
import {LOCAL_STORAGE} from "../../constants";

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        customDialog: {
            position: "absolute",
            top: 100
        }
    };
});

export function getNetwork(): string {
    let network = localStorage.getItem(LOCAL_STORAGE.NETWORK);
    if (!network) {
        network = NETWORKS.MAINNET;
    }
    return network;
}

export function setNetwork(name: string): void {
    localStorage.setItem(LOCAL_STORAGE.NETWORK, name);
}

function Settings(): JSX.Element {
    const [network, updateNetwork] = useState<string>(getNetwork());

    const settings = useSelector((state: RootState) => state.settings);
    const dispatch = useDispatch();
    const classes = useStyles();

    const networks = getNetworks();

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
                            <RadioGroup value={network} onChange={(ev) => {
                                const network = ev.target.value;
                                updateNetwork(network);
                                setNetwork(network);
                                dispatch(setNetworkAction(network));
                            }}>
                                {networks.map((network) => {
                                    return <FormControlLabel key={network.name} value={network.name} control={<Radio color="primary"/>} label={network.label} />;
                                })}
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

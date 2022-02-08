import './MintNft.scss';
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton, makeStyles,
    TextField
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {A_CreateAssetParams} from "@algodesk/core";
import {setAction} from "../../redux/actions/assetActions";
import {CancelOutlined} from "@material-ui/icons";
import React, {useState} from "react";
import {getCommonStyles} from "../../utils/styles";


const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        customDialog: {
            position: "absolute",
            top: 100,
            maxWidth: 700
        }
    };
});

interface MintNftState extends A_CreateAssetParams {
    note: string,
    enableManager: boolean,
    enableReserve: boolean,
    enableFreeze: boolean,
    enableClawback: boolean,
    description: string,
    file?: File,
    fileData?: string
}
const initialState: MintNftState = {
    clawback: "",
    creator: "",
    decimals: 0,
    defaultFrozen: false,
    freeze: "",
    manager: "",
    reserve: "",
    total: 1000,
    unitName: "",
    url: "",
    name: '',
    note: '',
    enableManager: true,
    enableReserve: true,
    enableFreeze: true,
    enableClawback: true,
    description: ''
};

function MintNft(): JSX.Element {
    
    const dispatch = useDispatch();
    const assetActions = useSelector((state: RootState) => state.assetActions);
    const show = assetActions.action === 'mint_nft';
    const classes = useStyles();


    const [
        {name, unitName, description, file, fileData
        },
        setState
    ] = useState({
        ...initialState
    });

    const clearState = () => {
        setState({
            ...initialState
        });
    };
    
    return (<div>
        {show ? <Dialog
            fullWidth={true}
            maxWidth={"sm"}
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
                        clearState();
                    }}>
                        <CancelOutlined />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent>
                <div className="mint-nft-wrapper">
                    <div className="mint-nft-container">
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={5} lg={5} xl={5}>
                                <div className="file-upload-wrapper">
                                    <div className="file-upload-container">
                                        {file ? <div className="file-content">
                                            <img src={fileData} alt="File content"/>
                                        </div> : <Button
                                            className="upload-button"
                                            color={"primary"}
                                            variant="contained"
                                            component="label">
                                            Choose File
                                            <input
                                                type="file"
                                                hidden
                                                multiple={false}
                                                onChange={(ev) =>{
                                                    const file = ev.target.files[0];
                                                    setState(prevState => ({...prevState, file}));

                                                    const reader = new FileReader();
                                                    reader.addEventListener("load", function () {
                                                        console.log(reader.result);
                                                        setState(prevState => ({...prevState, fileData: reader.result.toString()}));
                                                    }, false);

                                                    if (file) {
                                                        reader.readAsDataURL(file);
                                                    }
                                                }
                                                }
                                            />
                                        </Button>}
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={6} md={7} lg={7} xl={7}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <TextField
                                            required
                                            value={name}
                                            placeholder="CryptoKittie #99"
                                            onChange={(ev) => {
                                                setState(prevState => ({...prevState, name: ev.target.value}));
                                            }}
                                            label="Name" variant="outlined" fullWidth/>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <TextField
                                            required
                                            placeholder="Kittie"
                                            value={unitName}
                                            onChange={(ev) => {
                                                setState(prevState => ({...prevState, unitName: ev.target.value}));
                                            }}
                                            label="Unit name" variant="outlined" fullWidth/>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <TextField
                                            value={description}
                                            onChange={(ev) => {
                                                setState(prevState => ({...prevState, description: ev.target.value}));
                                            }}
                                            multiline
                                            rows={4}
                                            placeholder="Your NFT description"
                                            label="Description" variant="outlined" fullWidth/>
                                    </Grid>


                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="modal-footer-align">
                                        <Button color={"primary"}
                                                style={{marginTop: 15, marginBottom: 10}}
                                                variant={"contained"} size={"large"} onClick={() => {

                                        }}>Mint</Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>


                    </div>
                </div>
            </DialogContent>
            <DialogActions>

            </DialogActions>
        </Dialog> : ''}
    </div>);
}

export default MintNft;

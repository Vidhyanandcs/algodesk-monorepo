import './MintNft.scss';
import {
    Button, ButtonGroup,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton, makeStyles,
    TextField
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {A_CreateAssetParams, A_Nft_MetaData_Arc69, cidToIpfsFile, NFT_STANDARDS, uploadToIpfs} from "@algodesk/core";
import {setAction} from "../../redux/actions/assetActions";
import {CancelOutlined} from "@material-ui/icons";
import React, {useState} from "react";
import {getCommonStyles} from "../../utils/styles";
import {showSnack} from "../../redux/actions/snackbar";
import {hideLoader, showLoader} from "../../redux/actions/loader";
import algosdk from "../../utils/algosdk";
import {loadAccount} from "../../redux/actions/account";
import {showTransactionDetails} from "../../redux/actions/transaction";
import {handleException} from "../../redux/actions/exception";
import {REACT_APP_NFT_STORAGE_API_KEY} from "../../env";


const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        customDialog: {
            position: "absolute",
            top: 100
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
    fileData?: string,
    standard: string
}
const initialState: MintNftState = {
    clawback: undefined,
    creator: "",
    decimals: 0,
    defaultFrozen: false,
    freeze: undefined,
    manager: undefined,
    reserve: undefined,
    total: 1,
    unitName: "",
    url: "",
    name: '',
    note: '',
    enableManager: true,
    enableReserve: true,
    enableFreeze: true,
    enableClawback: true,
    description: '',
    standard: NFT_STANDARDS.ARC69
};

function MintNft(): JSX.Element {
    
    const dispatch = useDispatch();
    const assetActions = useSelector((state: RootState) => state.assetActions);
    const account = useSelector((state: RootState) => state.account);
    const {information} = account;
    const show = assetActions.action === 'mint_nft';
    const classes = useStyles();


    const [
        {name, unitName, description, file, fileData, decimals, manager, freeze, reserve, clawback, total, standard
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

    async function mint() {
        let message = '';

        console.log(file);
        if (!file || !fileData) {
            message = 'Invalid file';
        }
        if (!name) {
            message = 'Invalid name';
        }
        else if (name.length > 32) {
            message = 'Name cannot exceed 32 characters'
        }
        else if (!unitName) {
            message = 'Invalid unit name';
        }
        else if (unitName.length > 8) {
            message = 'Unit name cannot exceed 8 characters';
        }
        if (!description) {
            message = 'Invalid description';
        }

        if (message) {
            dispatch(showSnack({
                severity: 'error',
                message
            }));
            return;
        }

        try {

            dispatch(showLoader('Uploading file to ipfs ...'));
            const cid = await uploadToIpfs(REACT_APP_NFT_STORAGE_API_KEY, file);
            dispatch(hideLoader());

            const assetParams: A_CreateAssetParams = {
                creator: information.address,
                decimals,
                defaultFrozen: false,
                manager,
                reserve,
                freeze,
                clawback,
                total,
                url: cidToIpfsFile(cid),
                name,
                unitName
            };

            const note: A_Nft_MetaData_Arc69 = {
                standard: NFT_STANDARDS.ARC69,
                description,
                mime_type: file.type,
                external_url: '',
                properties: {}
            };

            dispatch(showLoader('Minting your NFT ...'));
            const {txId} = await algosdk.algodesk.assetClient.create(assetParams, JSON.stringify(note));
            dispatch(hideLoader());
            dispatch(showLoader('Waiting for confirmation ...'));
            await algosdk.algodesk.transactionClient.waitForConfirmation(txId);
            dispatch(hideLoader());
            clearState();
            dispatch(setAction(''));
            dispatch(loadAccount(information.address));
            dispatch(showTransactionDetails(txId));
        }
        catch (e: any) {
            dispatch(handleException(e));
            dispatch(hideLoader());
        }

    }

    return (<div>
        {show ? <Dialog
            fullWidth={true}
            maxWidth={"md"}
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
                                            <IconButton className="remove" color="primary" onClick={() => {
                                                setState(prevState => ({...prevState, fileData: '', file: undefined}));
                                            }}>
                                                <CancelOutlined />
                                            </IconButton>
                                        </div> : <Button
                                            className="upload-button"
                                            color={"primary"}
                                            variant="outlined"
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
                                        <ButtonGroup variant="outlined" color="primary" fullWidth>
                                            <Button variant={standard === NFT_STANDARDS.ARC69 ? 'contained' : 'outlined'} onClick={() => {
                                                setState(prevState => ({...prevState, standard: NFT_STANDARDS.ARC69}));
                                            }}>ARC69</Button>
                                            <Button variant={standard === NFT_STANDARDS.ARC3 ? 'contained' : 'outlined'} onClick={() => {
                                                setState(prevState => ({...prevState, standard: NFT_STANDARDS.ARC3}));
                                            }}>ARC3</Button>
                                        </ButtonGroup>
                                    </Grid>

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
                                                    mint();
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

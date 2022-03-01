import './CreatePool.scss';
import {
    Breadcrumbs,
    Button, FormControl,
    Grid,
    IconButton,
    InputAdornment, InputLabel, Link,
    makeStyles,
    MenuItem,
    Select,
    TextField, Typography,
} from "@material-ui/core";
import 'date-fns';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {A_Asset, getBlockByDate, isNumber, uploadToIpfs} from "@algodesk/core";
import React, {useEffect, useState} from "react";
import fSdk from "../../utils/fSdk";
import {ArrowBack, CancelOutlined, DateRange, PhotoSizeSelectActual} from "@material-ui/icons";
import {useHistory} from "react-router-dom";
import {getCommonStyles} from "../../utils/styles";
import {hideLoader, showLoader} from "../../redux/actions/loader";
import { DateTimePicker } from "@material-ui/pickers";
import {create, setAction} from "../../redux/actions/pool";
import {F_CreatePool, F_PoolMetaData} from "@fundstack/sdk";
import {handleException} from "../../redux/actions/exception";
import CreateAsset from "../CreateAsset/CreateAsset";
import {REACT_APP_NFT_STORAGE_API_KEY} from "../../env";
import {showSnack} from "../../redux/actions/snackbar";
import isEmpty from 'is-empty';
import moment from 'moment';


const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme)
    };
});

interface CreatePoolState{
    name: string,
    website: string,
    whitePaper: string,
    github: string,
    twitter: string,
    tokenomics: string,
    assetId: number,
    assetDetails?: A_Asset,
    totalAllocation: string,
    minAllocation: string,
    maxAllocation: string,
    price: string,
    regStartsAt: Date,
    regEndsAt: Date,
    saleStartsAt: Date,
    saleEndsAt: Date,
    file?: File,
    fileData?: string,
}

//const day = 60 * 60 * 24 * 1000;
const minute = 60 * 1000;

const initialState: CreatePoolState = {
    name: "",
    website: "",
    whitePaper: "",
    github: "",
    twitter: "",
    tokenomics: "",
    assetId: 0,
    totalAllocation: '',
    minAllocation: '',
    maxAllocation: '',
    price: '',
    regStartsAt: new Date(new Date().getTime() + 5 * minute),
    regEndsAt: new Date(new Date().getTime() + 10 * minute),
    saleStartsAt: new Date(new Date().getTime() + 11 * minute),
    saleEndsAt: new Date(new Date().getTime() + 16 * minute + minute)
};

function CreatePool(): JSX.Element {
    const dispatch = useDispatch();
    const account = useSelector((state: RootState) => state.account);
    const history = useHistory();
    const classes = useStyles();
    const createdAssets = fSdk.fs.algodesk.accountClient.getCreatedAssets(account.information);



    const [
        { name, website, tokenomics, github, twitter, whitePaper, assetId, assetDetails, totalAllocation, minAllocation, maxAllocation, price, regStartsAt, regEndsAt, saleStartsAt, saleEndsAt, file, fileData },
        setState
    ] = useState(initialState);

    useEffect(() => {
        setState(prevState => ({...prevState,
            regStartsAt: new Date(new Date().getTime() + 5 * minute),
            regEndsAt: new Date(new Date().getTime() + 10 * minute),
            saleStartsAt: new Date(new Date().getTime() + 11 * minute),
            saleEndsAt: new Date(new Date().getTime() + 16 * minute + minute)
        }));
    }, []);


    return (<div className={"create-pool-wrapper"}>
        <div className={"create-pool-container"}>


            <div className="form-wrapper">
                <div className="form-container">

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>

                        </Grid>
                        <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                            <Breadcrumbs className="crumb">
                                <Link underline="hover" color="inherit" href="#/portal/dashboard/pools/home">
                                    Home
                                </Link>
                                <Typography color="textPrimary">Create pool</Typography>
                            </Breadcrumbs>

                            <div className={classes.primaryText + " section-title"}>
                                <span>Company details</span>
                            </div>

                            <Grid container spacing={2}>




                                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                    <div className="com-detail-sec">
                                        <TextField
                                            name="name"
                                            required
                                            fullWidth
                                            label="Name"
                                            variant={"outlined"}
                                            autoFocus
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            placeholder="Company name"
                                            value={name}
                                            onChange={(ev) => {
                                                setState(prevState => ({...prevState, name: ev.target.value}));
                                            }}
                                        />
                                    </div>

                                    <div className="com-detail-sec">
                                        <TextField
                                            name="website"
                                            required
                                            fullWidth
                                            label="Website"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            placeholder="https://mycompany.com"
                                            variant={"outlined"}
                                            value={website}
                                            onChange={(ev) => {
                                                setState(prevState => ({...prevState, website: ev.target.value}));
                                            }}
                                        />
                                    </div>

                                    <div className="com-detail-sec">
                                        <TextField
                                            name="white_paper"
                                            required
                                            fullWidth
                                            label="White paper"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            placeholder="https://mycompany.com/white-paper.html"
                                            variant={"outlined"}
                                            value={whitePaper}
                                            onChange={(ev) => {
                                                setState(prevState => ({...prevState, whitePaper: ev.target.value}));
                                            }}
                                        />
                                    </div>

                                    <div className="com-detail-sec">
                                        <TextField
                                            name="github"
                                            required
                                            fullWidth
                                            label="Github"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            placeholder="https://github.com/mycompany"
                                            variant={"outlined"}
                                            value={github}
                                            onChange={(ev) => {
                                                setState(prevState => ({...prevState, github: ev.target.value}));
                                            }}
                                        />
                                    </div>

                                    <div className="com-detail-sec">
                                        <TextField
                                            name="tokenomics"
                                            required
                                            fullWidth
                                            label="Tokenomics"
                                            placeholder="https://mycompany.com/tokenomics.html"
                                            variant={"outlined"}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            value={tokenomics}
                                            onChange={(ev) => {
                                                setState(prevState => ({...prevState, tokenomics: ev.target.value}));
                                            }}
                                        />
                                    </div>

                                    <div className="com-detail-sec">
                                        <TextField
                                            name="twitter"
                                            required
                                            fullWidth
                                            label="Twitter"
                                            placeholder="https://twitter.com/mycompany"
                                            variant={"outlined"}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            value={twitter}
                                            onChange={(ev) => {
                                                setState(prevState => ({...prevState, twitter: ev.target.value}));
                                            }}
                                        />
                                    </div>






                                </Grid>

                                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                    <div className="file-upload-wrapper">
                                        <div className="file-upload-container">
                                            {file ? <div className="file-content">
                                                <img src={fileData} alt="File content"/>
                                                <IconButton className="remove" style={{color: '#000'}} onClick={() => {
                                                    setState(prevState => ({...prevState, fileData: '', file: undefined}));
                                                }}>
                                                    <CancelOutlined />
                                                </IconButton>
                                            </div> : <Button
                                                className="upload-button"
                                                color={"primary"}
                                                variant="outlined"
                                                startIcon={<PhotoSizeSelectActual></PhotoSizeSelectActual>}
                                                component="label">
                                                Upload logo
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



                            </Grid>

                            <div className={classes.primaryText + " section-title"}>
                                <span>Asset information</span>
                                <i>Don't have an asset ? </i>
                                <Button
                                    variant={"contained"}
                                    size={"small"}
                                    color={"primary"}
                                    style={{position: "absolute", right: 0, top: -8}}
                                    onClick={() => {
                                        dispatch(setAction('create_asset'));
                                    }}
                                >Create asset</Button>
                            </div>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                    <FormControl variant="outlined" fullWidth>
                                        <InputLabel id="asset_id_label">Select asset</InputLabel>
                                        <Select
                                            fullWidth
                                            color={"primary"}
                                            value={assetId}
                                            labelId="asset_id_label"
                                            onChange={async (event) => {
                                                const assetId = parseInt(event.target.value + "");
                                                try {
                                                    dispatch(showLoader("Loading asset details"));
                                                    const assetDetails = await fSdk.fs.algodesk.assetClient.get(assetId);
                                                    setState(prevState => ({...prevState, assetId, assetDetails}));
                                                    dispatch(hideLoader());
                                                }
                                                catch (e: any) {
                                                    dispatch(handleException(e));
                                                    dispatch(hideLoader());
                                                }
                                            }}
                                            label="Select asset"
                                        >
                                            {createdAssets.map((asset) => {
                                                return (<MenuItem value={asset.index} key={asset.index}>{asset.params.name}</MenuItem>)
                                            })}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                    <TextField
                                        name="price"
                                        required
                                        fullWidth
                                        label="Price"
                                        variant={"outlined"}
                                        type={"number"}
                                        placeholder="0.1"
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">1 &nbsp; {assetDetails ? <span className={classes.primaryText}>{assetDetails.params['unit-name']}</span> : ""} &nbsp; = </InputAdornment>,
                                            endAdornment: <InputAdornment position="end" color="primary">Algo</InputAdornment>,
                                        }}
                                        value={price}
                                        onChange={(ev) => {
                                            setState(prevState => ({...prevState, price: ev.target.value + ""}));
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                    <TextField
                                        name="total_allocation"
                                        required
                                        fullWidth
                                        label="Total allocation"
                                        variant={"outlined"}
                                        type={"number"}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        placeholder="1000000"
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end" color="primary">{assetDetails ? <span className={classes.primaryText}>{assetDetails.params['unit-name']}</span> : ""}</InputAdornment>,
                                        }}
                                        value={totalAllocation}
                                        onChange={(ev) => {
                                            setState(prevState => ({...prevState, totalAllocation: ev.target.value + ""}));
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                    <TextField
                                        name="min_allocation"
                                        required
                                        fullWidth
                                        label="Minimum allocation"
                                        variant={"outlined"}
                                        type={"number"}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        placeholder="100000"
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end" color="primary">{assetDetails ? <span className={classes.primaryText}>{assetDetails.params['unit-name']}</span> : ""}</InputAdornment>,
                                        }}
                                        value={minAllocation}
                                        onChange={(ev) => {
                                            setState(prevState => ({...prevState, minAllocation: ev.target.value + ""}));
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                    <TextField
                                        name="max_allocation"
                                        required
                                        fullWidth
                                        label="Max allocation"
                                        variant={"outlined"}
                                        type={"number"}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        placeholder="200000"
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end" color="primary">{assetDetails ? <span className={classes.primaryText}>{assetDetails.params['unit-name']}</span> : ""}</InputAdornment>,
                                        }}
                                        value={maxAllocation}
                                        onChange={(ev) => {
                                            setState(prevState => ({...prevState, maxAllocation: ev.target.value + ""}));
                                        }}
                                    />
                                </Grid>

                            </Grid>

                            <div className={classes.primaryText + " section-title"}>
                                <span>Registration & Sale schedule</span>
                            </div>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                    <DateTimePicker
                                        value={regStartsAt}
                                        disablePast
                                        onChange={(val) => {
                                            setState(prevState => ({...prevState, regStartsAt: val}));
                                        }}
                                        label="Registration start date"
                                        showTodayButton
                                        inputVariant="outlined"
                                        fullWidth
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton>
                                                        <DateRange />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                    <DateTimePicker
                                        value={regEndsAt}
                                        disablePast
                                        onChange={(val) => {
                                            setState(prevState => ({...prevState, regEndsAt: val}));
                                        }}
                                        label="Registration end date"
                                        showTodayButton
                                        inputVariant="outlined"
                                        fullWidth
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton>
                                                        <DateRange />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                    <DateTimePicker
                                        value={saleStartsAt}
                                        disablePast
                                        onChange={(val) => {
                                            setState(prevState => ({...prevState, saleStartsAt: val}));
                                        }}
                                        label="Sale start date"
                                        showTodayButton
                                        inputVariant="outlined"
                                        fullWidth
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton>
                                                        <DateRange />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                    <DateTimePicker
                                        value={saleEndsAt}
                                        disablePast
                                        onChange={(val) => {
                                            setState(prevState => ({...prevState, saleEndsAt: val}));
                                        }}
                                        label="Sale end date"
                                        showTodayButton
                                        inputVariant="outlined"
                                        fullWidth
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton>
                                                        <DateRange />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                            </Grid>


                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                        </Grid>
                    </Grid>


                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>

                        </Grid>
                        <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>



                            <div style={{marginTop: 20, textAlign: "center"}}>
                                <Button
                                    variant={"outlined"}
                                    size={"large"}
                                    startIcon={<ArrowBack></ArrowBack>}
                                    className={"custom-button"}
                                    style={{marginRight: 15}}
                                    onClick={() => {
                                        history.push('/portal/dashboard/pools/home');
                                    }}
                                >Back</Button>

                                <Button
                                    color={"primary"}
                                    variant={"contained"}
                                    size={"large"}
                                    className={"custom-button"}
                                    onClick={async () => {
                                        let currentRound: number;
                                        let logoCid = '';
                                        let message = '';

                                        if (!file) {
                                            message = 'Invalid logo';
                                        }
                                        else if (isEmpty(name)) {
                                            message = 'Invalid name';
                                        }
                                        else if (isEmpty(assetId)) {
                                            message = 'Invalid asset';
                                        }
                                        else if (isEmpty(totalAllocation)) {
                                            message = 'Invalid totalAllocation';
                                        }
                                        else if (isEmpty(minAllocation)) {
                                            message = 'Invalid minAllocation';
                                        }
                                        else if (isEmpty(maxAllocation)) {
                                            message = 'Invalid maxAllocation';
                                        }
                                        else if (isEmpty(price) || !isNumber(price)) {
                                            message = 'Invalid price';
                                        }
                                        else if (moment(regStartsAt) < moment()) {
                                            message = 'Registration start date cannot be in the past';
                                        }
                                        else if (moment(regStartsAt) < moment()) {
                                            message = 'Registration start date cannot be in the past';
                                        }
                                        else if (moment(regEndsAt) < moment()) {
                                            message = 'Registration end date cannot be in the past';
                                        }
                                        else if (moment(saleStartsAt) < moment()) {
                                            message = 'Sale start date cannot be in the past';
                                        }
                                        else if (moment(saleEndsAt) < moment()) {
                                            message = 'Sale end date cannot be in the past';
                                        }
                                        else if (moment(regEndsAt) < moment(regStartsAt)) {
                                            message = 'Registration end date should be greater that registration start date';
                                        }
                                        else if (moment(saleStartsAt) < moment(regEndsAt)) {
                                            message = 'Sale start date should be greater that registration end date';
                                        }
                                        else if (moment(saleEndsAt) < moment(saleStartsAt)) {
                                            message = 'Sale end date should be greater that sale start date';
                                        }

                                        if (message) {
                                            dispatch(showSnack({
                                                severity: 'error',
                                                message
                                            }));
                                            return;
                                        }

                                        try {
                                            dispatch(showLoader('Uploading metadata to ipfs ...'));
                                            logoCid = await uploadToIpfs(REACT_APP_NFT_STORAGE_API_KEY, file);
                                            dispatch(hideLoader());

                                            dispatch(showLoader("Checking network status ..."));
                                            currentRound = await fSdk.fs.algodesk.transactionClient.getCurrentRound();
                                            dispatch(hideLoader());
                                        }
                                        catch (e: any) {
                                            dispatch(handleException(e));
                                            dispatch(hideLoader());
                                            return;
                                        }

                                        const poolParams: F_CreatePool = {
                                            assetId,
                                            from: account.information.address,
                                            maxAllocation: Number(maxAllocation),
                                            minAllocation: Number(minAllocation),
                                            name,
                                            price: Number(price),
                                            regStartsAt: getBlockByDate(regStartsAt, currentRound),
                                            regEndsAt: getBlockByDate(regEndsAt, currentRound),
                                            saleStartsAt: getBlockByDate(saleStartsAt, currentRound),
                                            saleEndsAt: getBlockByDate(saleEndsAt, currentRound),
                                            totalAllocation: Number(totalAllocation),
                                            logoCid
                                        };

                                        const metadata: F_PoolMetaData = {
                                            github,
                                            tokenomics,
                                            twitter,
                                            website,
                                            whitePaper
                                        };

                                        const response = await dispatch(create({
                                            poolParams,
                                            metadata
                                        }));

                                        // @ts-ignore
                                        if (response.payload) {
                                            history.push('/portal/dashboard/pools/home');
                                        }
                                    }}
                                >Create pool</Button>


                            </div>

                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>

                        </Grid>
                    </Grid>
                </div>
            </div>


        <CreateAsset></CreateAsset>


        </div>
    </div>);
}

export default CreatePool;

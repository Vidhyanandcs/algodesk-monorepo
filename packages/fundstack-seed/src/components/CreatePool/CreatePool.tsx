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
import {A_Asset, getBlockByDate, uploadToIpfs} from "@algodesk/core";
import React, {useState} from "react";
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
    totalAllocation: number,
    minAllocation: number,
    maxAllocation: number,
    price: number,
    regStartsAt: Date,
    regEndsAt: Date,
    saleStartsAt: Date,
    saleEndsAt: Date,
    file?: File,
    fileData?: string,
}

const day = 60 * 60 * 24 * 1000;
const minute = 60 * 1000;

const initialState: CreatePoolState = {
    name: "google",
    website: "http://google.com",
    whitePaper: "http://google.com",
    github: "http://google.com",
    twitter: "http://google.com",
    tokenomics: "http://google.com",
    assetId: 0,
    totalAllocation: 1000,
    minAllocation: 100,
    maxAllocation: 600,
    price: 0.001,
    regStartsAt: new Date(new Date().getTime() + 1 * day),
    regEndsAt: new Date(new Date().getTime() + 2 * day),
    saleStartsAt: new Date(new Date().getTime() + 3 * day),
    saleEndsAt: new Date(new Date().getTime() + 4 * day + minute)
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

                                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
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


                                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}></Grid>

                                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                    <TextField
                                        name="name"
                                        required
                                        fullWidth
                                        label="Name"
                                        variant={"outlined"}
                                        autoFocus
                                        value={name}
                                        onChange={(ev) => {
                                            setState(prevState => ({...prevState, name: ev.target.value}));
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                    <TextField
                                        name="website"
                                        required
                                        fullWidth
                                        label="Website"
                                        placeholder="https://mycompany.com"
                                        variant={"outlined"}
                                        value={website}
                                        onChange={(ev) => {
                                            setState(prevState => ({...prevState, website: ev.target.value}));
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                    <TextField
                                        name="white_paper"
                                        required
                                        fullWidth
                                        label="White paper"
                                        placeholder="https://mycompany.com/white_paper.html"
                                        variant={"outlined"}
                                        value={whitePaper}
                                        onChange={(ev) => {
                                            setState(prevState => ({...prevState, whitePaper: ev.target.value}));
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                    <TextField
                                        name="github"
                                        required
                                        fullWidth
                                        label="Github"
                                        placeholder="https://github.com/mycompany"
                                        variant={"outlined"}
                                        value={github}
                                        onChange={(ev) => {
                                            setState(prevState => ({...prevState, github: ev.target.value}));
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                    <TextField
                                        name="tokenomics"
                                        required
                                        fullWidth
                                        label="Tokenomics"
                                        placeholder="https://mycompany.com/tokenomics.html"
                                        variant={"outlined"}
                                        value={tokenomics}
                                        onChange={(ev) => {
                                            setState(prevState => ({...prevState, tokenomics: ev.target.value}));
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                    <TextField
                                        name="twitter"
                                        required
                                        fullWidth
                                        label="Twitter"
                                        placeholder="https://twitter.com/mycompany"
                                        variant={"outlined"}
                                        value={twitter}
                                        onChange={(ev) => {
                                            setState(prevState => ({...prevState, twitter: ev.target.value}));
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            <div className={classes.primaryText + " section-title"}>
                                <span>Asset information</span>
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
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">1 &nbsp; {assetDetails ? <span className={classes.primaryText}>{assetDetails.params['unit-name']}</span> : ""} &nbsp; = </InputAdornment>,
                                            endAdornment: <InputAdornment position="end" color="primary">Algo</InputAdornment>,
                                        }}
                                        value={price}
                                        onChange={(ev) => {
                                            const price = parseInt(ev.target.value + "");
                                            setState(prevState => ({...prevState, price}));
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
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end" color="primary">{assetDetails ? <span className={classes.primaryText}>{assetDetails.params['unit-name']}</span> : ""}</InputAdornment>,
                                        }}
                                        value={totalAllocation}
                                        onChange={(ev) => {
                                            const totalAllocation = parseInt(ev.target.value + "");
                                            setState(prevState => ({...prevState, totalAllocation}));
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
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end" color="primary">{assetDetails ? <span className={classes.primaryText}>{assetDetails.params['unit-name']}</span> : ""}</InputAdornment>,
                                        }}
                                        value={minAllocation}
                                        onChange={(ev) => {
                                            const minAllocation = parseInt(ev.target.value + "");
                                            setState(prevState => ({...prevState, minAllocation}));
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
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end" color="primary">{assetDetails ? <span className={classes.primaryText}>{assetDetails.params['unit-name']}</span> : ""}</InputAdornment>,
                                        }}
                                        value={maxAllocation}
                                        onChange={(ev) => {
                                            const maxAllocation = parseInt(ev.target.value + "");
                                            setState(prevState => ({...prevState, maxAllocation}));
                                        }}
                                    />
                                </Grid>

                            </Grid>

                            <div className={classes.primaryText + " section-title"}>
                                <span>Registration information</span>
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
                                        let metadataCid = '';

                                        try {
                                            dispatch(showLoader('Uploading metadata to ipfs ...'));
                                            logoCid = await uploadToIpfs(REACT_APP_NFT_STORAGE_API_KEY, file);
                                            dispatch(hideLoader());

                                            const metadata: F_PoolMetaData = {
                                                github,
                                                tokenomics,
                                                twitter,
                                                website,
                                                whitePaper,
                                                logoCid
                                            };

                                            const metadataBlob = new Blob([JSON.stringify(metadata)], { type: "application/json" })
                                            const metadataFile = new File([metadataBlob], "metadata.json")
                                            dispatch(showLoader('Uploading metadata to ipfs ...'));
                                            metadataCid = await uploadToIpfs(REACT_APP_NFT_STORAGE_API_KEY, metadataFile);

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
                                            maxAllocation,
                                            minAllocation,
                                            name,
                                            price,
                                            regStartsAt: getBlockByDate(regStartsAt, currentRound),
                                            regEndsAt: getBlockByDate(regEndsAt, currentRound),
                                            saleStartsAt: getBlockByDate(saleStartsAt, currentRound),
                                            saleEndsAt: getBlockByDate(saleEndsAt, currentRound),
                                            totalAllocation,
                                            metadataCid
                                        };

                                        const response = await dispatch(create(poolParams));

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

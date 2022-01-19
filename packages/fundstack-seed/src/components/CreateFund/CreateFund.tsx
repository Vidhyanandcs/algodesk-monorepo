import './CreateFund.scss';
import {
    Button, FormControl,
    Grid,
    IconButton,
    InputAdornment, InputLabel,
    makeStyles,
    MenuItem,
    Select,
    TextField,
} from "@material-ui/core";
import 'date-fns';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {A_Asset, getBlockByDate} from "@algodesk/core";
import React, {useState} from "react";
import fundstackSdk from "../../utils/fundstackSdk";
import {ArrowBack, DateRange} from "@material-ui/icons";
import {useHistory} from "react-router-dom";
import {getCommonStyles} from "../../utils/styles";
import {hideLoader, showLoader} from "../../redux/actions/loader";
import { DateTimePicker } from "@material-ui/pickers";
import {deploy} from "../../redux/actions/fund";
import {F_CompanyDetails, F_DeployFund} from "@fundstack/sdk";
import {handleException} from "../../redux/actions/exception";

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme)
    };
});

interface CreateFundState{
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
    saleEndsAt: Date
}

const day = 60 * 60 * 24 * 1000;
const minute = 60 * 1000;

const initialState: CreateFundState = {
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

function CreateFund(): JSX.Element {
    const dispatch = useDispatch();
    const account = useSelector((state: RootState) => state.account);
    const history = useHistory();
    const classes = useStyles();
    const createdAssets = fundstackSdk.fundstack.algodesk.accountClient.getCreatedAssets(account.information);

    const [
        { name, website, tokenomics, github, twitter, whitePaper, assetId, assetDetails, totalAllocation, minAllocation, maxAllocation, price, regStartsAt, regEndsAt, saleStartsAt, saleEndsAt },
        setState
    ] = useState(initialState);


    return (<div className={"create-fund-wrapper"}>
        <div className={"create-fund-container"}>
            
            <div className="form-wrapper">
                <div className="form-container">

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>

                        </Grid>
                        <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                            <div className={classes.primaryText + " section-title"}>
                                <span>Company details</span>
                            </div>

                            <Grid container spacing={2}>
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
                                                    const assetDetails = await fundstackSdk.fundstack.algodesk.assetClient.get(assetId);
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


                            <Button
                                color={"primary"}
                                variant={"contained"}
                                size={"large"}
                                className={"custom-button"}
                                style={{marginTop: 20, float: 'right'}}
                                onClick={async () => {
                                    let currentRound: number;

                                    try {
                                        dispatch(showLoader("Checking network status ..."));
                                        currentRound = await fundstackSdk.fundstack.algodesk.transactionClient.getCurrentRound();
                                        dispatch(hideLoader());
                                    }
                                    catch (e: any) {
                                        dispatch(handleException(e));
                                        dispatch(hideLoader());
                                        return;
                                    }

                                    const deployParams: F_DeployFund = {
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
                                        totalAllocation
                                    };
                                    const company: F_CompanyDetails = {
                                        github,
                                        tokenomics,
                                        twitter,
                                        website,
                                        whitePaper
                                    };

                                    const response = await dispatch(deploy({
                                        deployParams,
                                        company
                                    }));

                                    console.log(response);

                                    // @ts-ignore
                                    if (response.payload) {
                                        history.push('/portal/dashboard/funds/home');
                                    }
                                }}
                            >Deploy</Button>

                            <Button
                                variant={"outlined"}
                                size={"large"}
                                startIcon={<ArrowBack></ArrowBack>}
                                className={"custom-button"}
                                style={{marginTop: 20, float: 'right', marginRight: 20}}
                                onClick={() => {
                                    history.push('/portal/dashboard/funds/home');
                                }}
                            >Back</Button>
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>

                        </Grid>
                    </Grid>
                </div>
            </div>





        </div>
    </div>);
}

export default CreateFund;

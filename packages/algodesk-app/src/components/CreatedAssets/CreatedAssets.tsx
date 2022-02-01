import './CreatedAssets.scss';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {
    Grid,
    CardHeader,
    IconButton,
    CardContent,
    MenuItem,
    Menu, makeStyles, Button, Tooltip, Card, FormControlLabel, Checkbox, TextField, InputAdornment
} from "@material-ui/core";
import {
    Launch,
    EditOutlined,
    LockOutlined,
    DeleteOutlined,
    SendOutlined,
    SettingsBackupRestoreSharp,
    CheckCircle,
    NotInterested,
    SwapHorizontalCircleOutlined,
    MoreVert,
    ControlPoint, Search
} from '@material-ui/icons';
import {A_Asset, debounce, ellipseAddress, NETWORKS} from "@algodesk/core";
import React, {useEffect, useState} from "react";
import {setSelectedAsset, setAction} from '../../redux/actions/assetActions';
import algosdk from "../../utils/algosdk";
import {showSnack} from "../../redux/actions/snackbar";
import {getCommonStyles} from "../../utils/styles";
import emptyVector from '../../assets/images/empty-assets.png';

function processAssetParam(value: string = ""): string {
    return value ? ellipseAddress(value, 12) : "[None]";
}

function renderAssetParam(label: string = "", value: string = "", addr: string): JSX.Element {
    const cls: string[] = ['value back-highlight'];
    const indicatorCls: string [] = ['indicator'];
    let icon = <NotInterested fontSize={"large"}></NotInterested>;

    if (value) {
        cls.push('clickable');
        if (value === addr) {
            icon = <CheckCircle fontSize={"large"} color={"primary"}></CheckCircle>;
        }
    }
    else {
        cls.push('empty');
    }

    return (<div className="param">
        <div className="key">
            {label}
        </div>
        <div className={cls.join(" ")} onClick={() => {
            algosdk.explorer.openAccount(value);
        }}>
            {processAssetParam(value)}
            <span className={indicatorCls.join(" ")}>
                {icon}
            </span>
        </div>
    </div>);
}

interface AssetsState{
    menuAnchorEl?: any
    hideZeroBal: boolean
    filteredAssets: A_Asset[]
    searchText: string
}

const initialState: AssetsState = {
    hideZeroBal: false,
    filteredAssets: [],
    searchText: ''
};

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
    };
});

function CreatedAssets(): JSX.Element {

    const account = useSelector((state: RootState) => state.account);
    const {information, createdAssets} = account;
    const assetActions = useSelector((state: RootState) => state.assetActions);
    const {selectedAsset} = assetActions;
    const network = useSelector((state: RootState) => state.network);
    const dispatch = useDispatch();
    const classes = useStyles();

    const [
        { menuAnchorEl, hideZeroBal, filteredAssets, searchText },
        setState
    ] = useState(initialState);



    useEffect(() => {
        const filterAssets = () => {
            let filteredAssets: A_Asset[] = [];
            if (hideZeroBal) {
                filteredAssets = createdAssets.filter((asset) => {
                    const assetBal = algosdk.algodesk.accountClient.getAssetBal(asset, information);
                    return assetBal !== 0;
                });
            }
            else {
                filteredAssets = createdAssets;
            }

            if (searchText) {
                filteredAssets = filteredAssets.filter((asset) => {
                    return asset.params.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
                });
            }

            setState(prevState => ({ ...prevState, filteredAssets}));
        }

        filterAssets();
    }, [hideZeroBal, createdAssets, information, searchText]);

    const closeMenu = () => {
        setState(prevState => ({ ...prevState, menuAnchorEl: undefined }));
    }

  return (
      <div className="created-assets-wrapper">
          <div className="created-assets-container">
              <div className="created-assets-header">
                  <div>
                      <TextField
                          placeholder="Name"
                          style={{marginRight: 20}}
                          InputProps={{
                              startAdornment: (
                                  <InputAdornment position="start" style={{color: '#828282'}}>
                                      <Search />
                                  </InputAdornment>
                              ),
                          }}
                          onChange={(ev) => {
                              debounce(() => {
                                  setState(prevState => ({...prevState, searchText: ev.target.value}));
                              }, 500)();
                          }}
                          label="Search asset" variant="outlined"/>

                      <FormControlLabel style={{marginTop: 8}} control={<Checkbox color={"primary"} checked={hideZeroBal} onChange={(ev, value) => {
                          setState((prevState) => ({ ...prevState, hideZeroBal: value }));
                      }}/>} label="Hide 0 balances"/>
                  </div>
                  <div>
                      <Button
                          color="primary"
                          startIcon={<ControlPoint></ControlPoint>}
                          variant={"contained"}
                          className="add-asset"
                          onClick={() => {
                              dispatch(setAction('create'));
                          }}
                          size={"large"}>
                          Create asset
                      </Button>

                  </div>
              </div>



              {createdAssets.length === 0 ?
                  <div className="empty-message">
                      <img src={emptyVector} alt="No assets"/>
                      <div className="text">
                          This account doesn't have any created assets
                      </div>
                  </div> : ''}
              {createdAssets.length > 0 && filteredAssets.length === 0?
                  <div className="empty-message">
                      <img src={emptyVector} alt="No results found"/>
                      <div className="text">
                          No results found
                      </div>
                  </div> : ''}
              <div className="assets">
                  <Grid container spacing={4}>
                      {filteredAssets.map((asset) => {
                          return (<Grid item xs={12} sm={6} md={6} lg={6} xl={6} key={asset.index}>

                              <Card className={'asset'}>
                                  <CardHeader
                                      action={
                                          <div>
                                              <Tooltip title="View in explorer">
                                                  <IconButton color={"primary"} onClick={(ev) => {
                                                      algosdk.explorer.openAsset(asset.index);
                                                  }}>
                                                      <Launch/>
                                                  </IconButton>
                                              </Tooltip>
                                              <Tooltip title="Asset actions">
                                                  <IconButton color={"primary"} onClick={(ev) => {
                                                      setState(prevState => ({ ...prevState, menuAnchorEl: ev.target}));
                                                      dispatch(setSelectedAsset(asset));
                                                  }}>
                                                      <MoreVert/>
                                                  </IconButton>
                                              </Tooltip>
                                          </div>
                                      }
                                      avatar={<div>
                                          <div className={classes.primaryText +' asset-id'}>{asset.params.name}</div>
                                      </div>}
                                      subheader=""
                                      variant="outlined"
                                  />
                                  <CardContent>
                                      <div className="params">
                                          <Grid container spacing={2}>


                                              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>

                                                  <div className={"name"}>
                                                      ID: {asset.index}
                                                  </div>
                                              </Grid>
                                              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                                  <div className={"balance "}>

                                                      Balance : {algosdk.algodesk.accountClient.getAssetBalWithTicker(asset, information)}
                                                  </div>

                                              </Grid>

                                              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                                  {renderAssetParam("Manager", asset.params.manager, information.address)}
                                              </Grid>
                                              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                                  {renderAssetParam("Reserve", asset.params.reserve, information.address)}
                                              </Grid>
                                              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                                  {renderAssetParam("Freeze", asset.params.freeze, information.address)}
                                              </Grid>
                                              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                                  {renderAssetParam("Clawback", asset.params.clawback, information.address)}
                                              </Grid>
                                          </Grid>
                                      </div>
                                  </CardContent>
                              </Card>
                          </Grid>);
                      })}
                  </Grid>
              </div>
          </div>
          <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={() => {
                  closeMenu();
              }}
              PaperProps={{
                  style: {
                      transform: 'translateX(-80px) translateY(40px)',
                  }
              }}
          >
              <MenuItem className={classes.primaryColorOnHover} onClick={() => {
                  dispatch(setAction('send'));
                  closeMenu();
              }}>
                  <SendOutlined className="asset-action-icon" fontSize={"small"}></SendOutlined>
                  Send assets
              </MenuItem>
              <MenuItem className={classes.primaryColorOnHover} onClick={() => {
                  if (algosdk.algodesk.accountClient.canManage(information.address, selectedAsset)) {
                      dispatch(setAction('modify'));
                  }
                  else {
                      dispatch(showSnack({
                          severity: 'error',
                          message: "You do not have enough permission to modify"
                      }));
                  }
                  closeMenu();
              }}>
                  <EditOutlined className="asset-action-icon" fontSize={"small"}></EditOutlined>
                  Modify asset
              </MenuItem>
              <MenuItem className={classes.primaryColorOnHover} onClick={() => {
                  if (algosdk.algodesk.accountClient.canFreeze(information.address, selectedAsset)) {
                      dispatch(setAction('freeze'));
                  }
                  else {
                      dispatch(showSnack({
                          severity: 'error',
                          message: "You do not have enough permission to freeze or unfreeze"
                      }));
                  }
                  closeMenu();
              }}>
                  <LockOutlined className="asset-action-icon" fontSize={"small"}></LockOutlined>
                  Freeze / Unfreeze
              </MenuItem>
              <MenuItem className={classes.primaryColorOnHover} onClick={() => {
                  if (algosdk.algodesk.accountClient.canClawback(information.address, selectedAsset)) {
                      dispatch(setAction('revoke'));
                  }
                  else {
                      dispatch(showSnack({
                          severity: 'error',
                          message: "You do not have enough permission to revoke"
                      }));
                  }
                  closeMenu();
              }}>
                  <SettingsBackupRestoreSharp className="asset-action-icon" fontSize={"small"}></SettingsBackupRestoreSharp>
                  Revoke assets
              </MenuItem>
              <MenuItem className={classes.primaryColorOnHover} onClick={() => {
                  if (algosdk.algodesk.accountClient.canManage(information.address, selectedAsset)) {
                      dispatch(setAction('delete'));
                  }
                  else {
                      dispatch(showSnack({
                          severity: 'error',
                          message: "You do not have enough permission to delete"
                      }));
                  }
                  closeMenu();
              }}>
                  <DeleteOutlined className="asset-action-icon" fontSize={"small"}></DeleteOutlined>
                  Delete asset
              </MenuItem>
              <MenuItem className={classes.primaryColorOnHover} onClick={(ev) => {
                  let url = 'https://app.tinyman.org';
                  if (network.name === NETWORKS.TESTNET) {
                      url = 'https://testnet.tinyman.org';
                  }
                  url += '/#/swap?asset_in=0&asset_out=' + selectedAsset.index;
                  window.open(url, "_blank");
                  closeMenu();
              }}>
                  <SwapHorizontalCircleOutlined className={"asset-action-icon"} fontSize={"small"}></SwapHorizontalCircleOutlined>
                  Swap (Tinyman)
              </MenuItem>
              {/*<MenuItem className={classes.primaryColorOnHover} onClick={() => {*/}
              {/*    dispatch(setAction('burn'));*/}
              {/*    closeMenu();*/}
              {/*}}>*/}
              {/*    <FireplaceOutlined className={"asset-action-icon"} fontSize={"small"}></FireplaceOutlined>*/}
              {/*    Burn supply*/}
              {/*</MenuItem>*/}
          </Menu>
      </div>
  );
}

export default CreatedAssets;

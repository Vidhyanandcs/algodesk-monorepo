import './OptedAssets.scss';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {
    Grid,
    CardHeader,
    IconButton,
    CardContent,
    MenuItem,
    Menu, makeStyles, Button, Tooltip, Card, FormControlLabel, Checkbox, TextField, InputAdornment, CardActions
} from "@material-ui/core";
import {
    Launch,
    EditOutlined,
    LockOutlined,
    DeleteOutlined,
    SendOutlined,
    SettingsBackupRestoreSharp,
    CheckCircleOutlined,
    SwapHorizontalCircleOutlined,
    MoreVert,
    HighlightOffOutlined,
    ControlPoint, Search, RemoveCircleOutlineOutlined
} from '@material-ui/icons';
import {A_Asset, debounce, NETWORKS} from "@algodesk/core";
import React, {useEffect, useState} from "react";
import {setSelectedAsset, setAction} from '../../redux/actions/assetActions';
import algosdk from "../../utils/algosdk";
import {showSnack} from "../../redux/actions/snackbar";
import {getCommonStyles} from "../../utils/styles";
import emptyVector from '../../assets/images/empty-assets.png';

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

function OptedAssets(): JSX.Element {

    const account = useSelector((state: RootState) => state.account);
    const {information, optedAssets} = account;
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
                filteredAssets = optedAssets.filter((asset) => {
                    const assetBal = algosdk.algodesk.accountClient.getAssetBal(asset, information);
                    return assetBal !== 0;
                });
            }
            else {
                filteredAssets = optedAssets;
            }

            if (searchText) {
                filteredAssets = filteredAssets.filter((asset) => {
                    return asset.params.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
                });
            }

            setState(prevState => ({ ...prevState, filteredAssets}));
        }

        filterAssets();
    }, [hideZeroBal, optedAssets, information, searchText]);

    const closeMenu = () => {
        setState(prevState => ({ ...prevState, menuAnchorEl: undefined }));
    }

  return (
      <div className="opted-assets-wrapper">
          <div className="opted-assets-container">
              <div className="opted-assets-header">
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
                              dispatch(setAction('opt_in'));
                          }}
                          size={"large"}>
                          Opt-In asset
                      </Button>

                  </div>
              </div>



              {optedAssets.length === 0 ?
                  <div className="empty-message">
                      <img src={emptyVector} alt="No assets"/>
                      <div className="text">
                          This account doesn't have any opted assets
                      </div>
                  </div> : ''}
              {optedAssets.length > 0 && filteredAssets.length === 0?
                  <div className="empty-message">
                      <img src={emptyVector} alt="No results found"/>
                      <div className="text">
                          No results found
                      </div>
                  </div> : ''}
              <div className="assets">
                  <Grid container spacing={4}>
                      {filteredAssets.map((asset) => {
                          return (<Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={asset.index}>

                              <Card className={'asset opted-asset'}>
                                  <CardHeader
                                      action={
                                          <div>
                                              <Tooltip title="View in explorer">
                                                  <IconButton onClick={(ev) => {
                                                      algosdk.explorer.openAsset(asset.index);
                                                  }}>
                                                      <Launch fontSize={"small"}/>
                                                  </IconButton>
                                              </Tooltip>
                                              <Tooltip title="Asset actions">
                                                  <IconButton onClick={(ev) => {
                                                      setState(prevState => ({ ...prevState, menuAnchorEl: ev.target}));
                                                      dispatch(setSelectedAsset(asset));
                                                  }}>
                                                      <MoreVert/>
                                                  </IconButton>
                                              </Tooltip>
                                          </div>
                                      }
                                      avatar={<div>
                                          <div className={'asset-name'}>{asset.params.name}</div>
                                      </div>}
                                      subheader=""
                                      variant="outlined"
                                      style={{borderBottom: "1px solid rgba(247,244,201,255)",
                                          marginBottom: 25,
                                          paddingBottom: 0}}
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

                                                      Balance: {algosdk.algodesk.accountClient.getAssetBalWithTicker(asset, information)}
                                                  </div>
                                              </Grid>
                                          </Grid>
                                      </div>






                                  </CardContent>
                                  <CardActions style={{padding: 15, background: 'rgba(247,244,201,0.2)'}}>
                                      <div className="roles">
                                          <div className={algosdk.algodesk.assetClient.hasManager(asset) ? 'role yes' : 'role no'}>
                                              Manager
                                              {algosdk.algodesk.assetClient.hasManager(asset) ? <CheckCircleOutlined fontSize={"small"}></CheckCircleOutlined> : <HighlightOffOutlined fontSize={"small"}></HighlightOffOutlined>}
                                          </div>

                                          <div className={algosdk.algodesk.assetClient.hasFreeze(asset) ? 'role yes' : 'role no'}>
                                              Freeze
                                              {algosdk.algodesk.assetClient.hasFreeze(asset) ? <CheckCircleOutlined fontSize={"small"}></CheckCircleOutlined> : <HighlightOffOutlined fontSize={"small"}></HighlightOffOutlined>}
                                          </div>

                                          <div className={algosdk.algodesk.assetClient.hasClawback(asset) ? 'role yes' : 'role no'}>
                                              Clawback
                                              {algosdk.algodesk.assetClient.hasClawback(asset) ? <CheckCircleOutlined fontSize={"small"}></CheckCircleOutlined> : <HighlightOffOutlined fontSize={"small"}></HighlightOffOutlined>}
                                          </div>

                                      </div>
                                  </CardActions>
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
              <MenuItem className={classes.yellowColorOnHover} onClick={() => {
                  dispatch(setAction('send'));
                  closeMenu();
              }}>
                  <SendOutlined className="asset-action-icon" fontSize={"small"}></SendOutlined>
                  Send assets
              </MenuItem>

              <MenuItem className={classes.yellowColorOnHover} onClick={() => {
                  dispatch(setAction('opt_out'));
                  closeMenu();
              }}>
                  <RemoveCircleOutlineOutlined className="asset-action-icon" fontSize={"small"}></RemoveCircleOutlineOutlined>
                  Opt-Out
              </MenuItem>

              {selectedAsset && algosdk.algodesk.accountClient.canManage(information.address, selectedAsset) ? <MenuItem className={classes.yellowColorOnHover} onClick={() => {
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
              </MenuItem> : ''}

              {selectedAsset && algosdk.algodesk.accountClient.canFreeze(information.address, selectedAsset) ? <MenuItem className={classes.yellowColorOnHover} onClick={() => {
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
              </MenuItem> : ''}


              {selectedAsset && algosdk.algodesk.accountClient.canClawback(information.address, selectedAsset) ? <MenuItem className={classes.yellowColorOnHover} onClick={() => {
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
              </MenuItem> : ''}


              {selectedAsset && algosdk.algodesk.accountClient.canManage(information.address, selectedAsset) ? <MenuItem className={classes.yellowColorOnHover} onClick={() => {
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
              </MenuItem> : ''}

              <MenuItem className={classes.yellowColorOnHover} onClick={(ev) => {
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
              {/*<MenuItem className={classes.yellowColorOnHover} onClick={() => {*/}
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

export default OptedAssets;

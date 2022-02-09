import './Nfts.scss';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {
    Grid,
    CardHeader,
    IconButton,
    CardContent,
    MenuItem,
    Menu, makeStyles, Button, Tooltip, Card, TextField, InputAdornment
} from "@material-ui/core";
import {
    Launch,
    EditOutlined,
    LockOutlined,
    DeleteOutlined,
    SendOutlined,
    SettingsBackupRestoreSharp,
    MoreVert,
    ControlPoint, Search, RemoveCircleOutlineOutlined, FireplaceOutlined, Link
} from '@material-ui/icons';
import {A_Nft, debounce, NETWORKS} from "@algodesk/core";
import React, {useEffect, useState} from "react";
import {setSelectedAsset, setAction} from '../../redux/actions/assetActions';
import algosdk from "../../utils/algosdk";
import {showSnack} from "../../redux/actions/snackbar";
import {getCommonStyles} from "../../utils/styles";
import emptyVector from '../../assets/images/empty-assets.png';

interface NftsState{
    menuAnchorEl?: any
    hideZeroBal: boolean
    filteredNfts: A_Nft[]
    searchText: string
}

const initialState: NftsState = {
    hideZeroBal: false,
    filteredNfts: [],
    searchText: ''
};

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
    };
});

function Nfts(): JSX.Element {

    const account = useSelector((state: RootState) => state.account);
    const {information, nfts} = account;
    const nftActions = useSelector((state: RootState) => state.nftActions);
    const {selectedNft} = nftActions;

    const network = useSelector((state: RootState) => state.network);
    const dispatch = useDispatch();
    const classes = useStyles();

    const [
        { menuAnchorEl, hideZeroBal, filteredNfts, searchText },
        setState
    ] = useState(initialState);



    useEffect(() => {
        const filterAssets = () => {
            let filteredNfts: A_Nft[] = nfts;

            if (searchText) {
                filteredNfts = nfts.filter(({asset}) => {
                    return asset.params.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
                });
            }

            setState(prevState => ({ ...prevState, filteredNfts}));
        }

        filterAssets();
    }, [hideZeroBal, nfts, information, searchText]);

    const closeMenu = () => {
        setState(prevState => ({ ...prevState, menuAnchorEl: undefined }));
    }

  return (
      <div className="nfts-wrapper">
          <div className="nfts-container">
              <div className="nfts-header">
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
                          label="Search nft" variant="outlined"/>
                  </div>
                  <div>
                      <Button
                          color="primary"
                          startIcon={<ControlPoint></ControlPoint>}
                          variant={"contained"}
                          className="add-asset"
                          onClick={() => {
                              dispatch(setAction('mint_nft'));
                          }}
                          size={"large"}>
                          Mint NFT
                      </Button>

                  </div>
              </div>



              {nfts.length === 0 ?
                  <div className="empty-message">
                      <img src={emptyVector} alt="No assets"/>
                      <div className="text">
                          This account doesn't have any NFT's
                      </div>
                  </div> : ''}
              {nfts.length > 0 && filteredNfts.length === 0?
                  <div className="empty-message">
                      <img src={emptyVector} alt="No results found"/>
                      <div className="text">
                          No results found
                      </div>
                  </div> : ''}
              <div className="nfts">
                  <Grid container spacing={4}>
                      {filteredNfts.map((nft) => {
                          const {asset} = nft;
                          return (<Grid item xs={12} sm={4} md={4} lg={3} xl={3} key={nft.asset.index}>

                              <Card className={'nft'}>
                                  <CardHeader
                                      action={
                                          <div>
                                              <Tooltip title="View on IPFS">
                                                  <IconButton onClick={(ev) => {
                                                      window.open(nft.media.web_url, "_blank");
                                                  }}>
                                                      <Link fontSize={"medium"}/>
                                                  </IconButton>
                                              </Tooltip>
                                              <Tooltip title="View in explorer">
                                                  <IconButton onClick={(ev) => {
                                                      algosdk.explorer.openAsset(asset.index);
                                                  }}>
                                                      <Launch fontSize={"small"}/>
                                                  </IconButton>
                                              </Tooltip>
                                              <Tooltip title="Actions">
                                                  <IconButton onClick={(ev) => {
                                                      setState(prevState => ({ ...prevState, menuAnchorEl: ev.target}));
                                                      dispatch(setSelectedAsset(asset));
                                                  }}>
                                                      <MoreVert/>
                                                  </IconButton>
                                              </Tooltip>
                                          </div>
                                      }
                                      subheader=""
                                      variant="outlined"
                                      style={{marginBottom: 5,paddingBottom: 0}}
                                  />

                                  <CardContent>


                                    <div className="nft-media">
                                        <img src={nft.media.web_url} alt={nft.media.web_url}/>
                                    </div>


                                    <div className="nft-params">
                                        <div className="row">
                                            <div className="item">
                                                ID
                                            </div>
                                            <div className="item">
                                                {asset.index}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="item">
                                                Name
                                            </div>
                                            <div className="item">
                                                {asset.params.name}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="item">
                                                Balance
                                            </div>
                                            <div className="item">
                                                {algosdk.algodesk.accountClient.getAssetBalWithTicker(asset, information)}
                                            </div>
                                        </div>

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
                  Send NFT
              </MenuItem>

              <MenuItem className={classes.primaryColorOnHover} onClick={() => {
                  dispatch(setAction('opt_out'));
                  closeMenu();
              }}>
                  <RemoveCircleOutlineOutlined className="asset-action-icon" fontSize={"small"}></RemoveCircleOutlineOutlined>
                  Opt-Out
              </MenuItem>

              {selectedNft && algosdk.algodesk.accountClient.canManage(information.address, selectedNft.asset) ? <MenuItem className={classes.primaryColorOnHover} onClick={() => {
                  if (algosdk.algodesk.accountClient.canManage(information.address, selectedNft.asset)) {
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

              {selectedNft && algosdk.algodesk.accountClient.canFreeze(information.address, selectedNft.asset) ? <MenuItem className={classes.primaryColorOnHover} onClick={() => {
                  if (algosdk.algodesk.accountClient.canFreeze(information.address, selectedNft.asset)) {
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


              {selectedNft && algosdk.algodesk.accountClient.canClawback(information.address, selectedNft.asset) ? <MenuItem className={classes.primaryColorOnHover} onClick={() => {
                  if (algosdk.algodesk.accountClient.canClawback(information.address, selectedNft.asset)) {
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


              {selectedNft && algosdk.algodesk.accountClient.canManage(information.address, selectedNft.asset) ? <MenuItem className={classes.primaryColorOnHover} onClick={() => {
                  if (algosdk.algodesk.accountClient.canManage(information.address, selectedNft.asset)) {
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

              <MenuItem className={classes.primaryColorOnHover} onClick={() => {
                  if (network.name === NETWORKS.MAINNET) {
                      dispatch(showSnack({
                          severity: 'error',
                          message: "This feature is not enabled on MainNet"
                      }));
                      closeMenu();
                      return;
                  }
                  dispatch(setAction('burn'));
                  closeMenu();
              }}>
                  <FireplaceOutlined className={"asset-action-icon"} fontSize={"small"}></FireplaceOutlined>
                  Burn supply
              </MenuItem>
          </Menu>
      </div>
  );
}

export default Nfts;

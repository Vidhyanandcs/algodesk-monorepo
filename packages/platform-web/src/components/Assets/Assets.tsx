import './Assets.scss';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {
    Grid,
    CardHeader,
    IconButton,
    CardContent,
    Button,
    MenuItem,
    Menu, Link
} from "@material-ui/core";
import {Alert} from '@material-ui/lab';
import {
    Add,
    Menu as MenuIcon,
    Edit,
    Lock,
    Delete,
    Send,
    SettingsBackupRestoreSharp,
    CheckCircle,
    NotInterested,
    OpenInNew
} from '@material-ui/icons';
import {getAssetBalWithTicker, openAccountInExplorer, openAssetInExplorer} from "../../utils/core";
import {ellipseAddress, NETWORKS} from "@algodesk/core";
import {useState} from "react";
import {setSelectedAsset, setAction} from '../../redux/actions/assetActions';
import SendAssets from "../SendAssets/SendAssets";
import CreateAsset from "../CreateAsset/CreateAsset";
import ModifyAsset from "../ModifyAsset/ModifyAsset";
import DeleteAsset from "../DeleteAsset/DeleteAsset";
import FreezeAccount from "../FreezeAssets/FreezeAccount";
import RevokeAssets from "../RevokeAssets/RevokeAssets";
import {BlackChip, CustomCard, CustomTooltip} from '../../utils/theme';
import algosdk from "../../utils/algosdk";
import {showSnack} from "../../redux/actions/snackbar";

function processAssetParam(value: string = ""): string {
    return value ? ellipseAddress(value, 12) : "(None)";
}

function renderAssetParam(label: string = "", value: string = "", addr: string): JSX.Element {
    const cls: string[] = ['value'];
    const indicatorCls: string [] = ['indicator'];
    let icon = <NotInterested fontSize={"small"} color={"secondary"}></NotInterested>;

    if (value) {
        cls.push('clickable');
        if (value === addr) {
            icon = <CheckCircle fontSize={"small"} color={"primary"}></CheckCircle>;
        }
    }

    return (<div className="param">
        <div className="key">
            {label}
            <span className={indicatorCls.join(" ")}>
                {icon}
            </span>
        </div>
        <div className={cls.join(" ")} onClick={() => {
            openAccountInExplorer(value);
        }}>
            {processAssetParam(value)}
        </div>
    </div>);
}

interface AssetsState{
    menuAnchorEl?: any
}

const initialState: AssetsState = {

};

function Assets(): JSX.Element {

    const account = useSelector((state: RootState) => state.account);
    const {information, createdAssets} = account;
    const assetActions = useSelector((state: RootState) => state.assetActions);
    const {selectedAsset} = assetActions;
    const network = useSelector((state: RootState) => state.network);
    const dispatch = useDispatch();

    const [
        { menuAnchorEl },
        setState
    ] = useState(initialState);

    const closeMenu = () => {
        setState(prevState => ({ ...prevState, menuAnchorEl: undefined }));
    }

  return (
      <div className="assets-wrapper">
          <div className="assets-container">
              <div className="title">
                  Created Assets

                  <div className="asset-count">
                      <BlackChip
                          label={createdAssets.length}
                          size={"small"}
                          variant={"default"}
                      />
                  </div>

              </div>

              <div>
                  <Button
                      color="primary"
                      startIcon={<Add></Add>}
                      variant={"contained"}
                      className="add-asset"
                      onClick={() => {
                          dispatch(setAction('create'));
                      }}
                      size={"large"}>
                      Create asset
                  </Button>
              </div>


              {createdAssets.length === 0 ?
                  <div className="empty-message">
                      <Alert icon={false} color={"warning"}>
                          This account doesn't have any created assets
                      </Alert>
                  </div> : ''}
              <div className="assets">
                  <Grid container spacing={2}>
                      {createdAssets.map((asset) => {
                          return (<Grid item xs={12} sm={6} md={6} lg={6} xl={6} key={asset.index}>

                              <CustomCard className={'asset'}>
                                  <CardHeader
                                      action={
                                          <div>
                                              <CustomTooltip title="Asset actions">
                                                  <IconButton onClick={(ev) => {
                                                      setState(prevState => ({ ...prevState, menuAnchorEl: ev.target}));
                                                      dispatch(setSelectedAsset(asset));
                                                  }}>
                                                      <MenuIcon />
                                                  </IconButton>
                                              </CustomTooltip>
                                          </div>
                                      }
                                      avatar={<div>
                                          <span className='asset-name'>{asset.params.name} ({asset.params['unit-name']})</span>
                                          <div className={'asset-id'} onClick={() => {
                                              openAssetInExplorer(asset.index);
                                          }
                                          }>ID: {asset.index}</div>
                                      </div>}
                                      subheader=""
                                      variant="outlined"
                                  />
                                  <CardContent>
                                      <div className="params">
                                          <Grid container spacing={2}>


                                              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                                  <div className="param">
                                                      <div className={"key"}>Balance </div>
                                                      <div className="value">
                                                          {getAssetBalWithTicker(asset, information)}
                                                      </div>
                                                  </div>

                                              </Grid>
                                              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                                  <div className="param">
                                                      <div className={"key"}>Url </div>
                                                      <div className="value">
                                                          {asset.params.url ? <Link href={asset.params.url} target="_blank">{asset.params.url}</Link> : '[Empty asset url]'}

                                                      </div>
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
                              </CustomCard>
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
              <MenuItem onClick={() => {
                  dispatch(setAction('send'));
                  closeMenu();
              }}>
                  <Send className="asset-action-icon" fontSize={"small"}></Send>
                  Send assets
              </MenuItem>
              <MenuItem onClick={() => {
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
                  <Edit className="asset-action-icon" fontSize={"small"}></Edit>
                  Modify asset
              </MenuItem>
              <MenuItem onClick={() => {
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
                  <Lock className="asset-action-icon" fontSize={"small"}></Lock>
                  Freeze / Unfreeze
              </MenuItem>
              <MenuItem onClick={() => {
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
              <MenuItem onClick={() => {
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
                  <Delete className="asset-action-icon" fontSize={"small"}></Delete>
                  Delete asset
              </MenuItem>
              {network.name === NETWORKS.TESTNET ? <MenuItem onClick={(ev) => {
                  const url = 'https://testnet.algodex.com/trade/' + selectedAsset.index;
                  window.open(url, "_blank");
              }}>
                  <OpenInNew className="asset-action-icon" fontSize={"small"}></OpenInNew>
                  Trade asset
              </MenuItem> : ''}
          </Menu>
          <SendAssets></SendAssets>
          <CreateAsset></CreateAsset>
          <ModifyAsset></ModifyAsset>
          <DeleteAsset></DeleteAsset>
          <FreezeAccount></FreezeAccount>
          <RevokeAssets></RevokeAssets>
      </div>
  );
}

export default Assets;

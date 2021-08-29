import './Assets.scss';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {
    Grid,
    Card,
    CardHeader,
    IconButton,
    makeStyles,
    CardContent,
    Button,
    MenuItem,
    Menu,
    CardActions
} from "@material-ui/core";
import {Alert} from '@material-ui/lab';
import {Add, Menu as MenuIcon, Edit, Lock, Delete, Send, SwapCalls} from '@material-ui/icons';
import {getCommonStyles} from "../../utils/styles";
import {getAssetBalWithTicker, openAccountInExplorer, openAssetInExplorer} from "../../utils/core";
import {ellipseAddress} from "@algodesk/core";
import {useState} from "react";
import {setSelectedAsset, setAction} from '../../redux/actions/assetActions';
import SendAssets from "../SendAssets/SendAssets";
import CreateAsset from "../CreateAsset/CreateAsset";
import ModifyAsset from "../ModifyAsset/ModifyAsset";
import DeleteAsset from "../DeleteAsset/DeleteAsset";
import FreezeAccount from "../FreezeAssets/FreezeAccount";
import RevokeAssets from "../RevokeAssets/RevokeAssets";

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        customDialog: {
            position: "absolute",
            top: 100
        }
    }
});

function processAssetParam(value: string = ""): string {
    return value ? ellipseAddress(value, 12) : "(None)";
}

function renderAssetParam(label: string = "", value: string = "", addr: string): JSX.Element {
    const cls: string[] = ['value'];
    const indicatorCls: string [] = ['indicator'];

    if (value) {
        cls.push('clickable');
        if (value === addr) {
            indicatorCls.push('green');
        }
        else {
            indicatorCls.push('orange');
        }
    }
    else {
        indicatorCls.push('red');
    }

    return (<div className="param">
        <div className="key">
            <span className={indicatorCls.join(" ")}></span>
            {label}
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
    const classes = useStyles();
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
                  My Assets
              </div>
              <Button
                  color="primary"
                  startIcon={<Add></Add>}
                  variant={"contained"}
                  onClick={() => {
                      dispatch(setAction('create'));
                  }}
                  size={"large"}>
                  Create asset
              </Button>
              {createdAssets.length === 0 ?
                  <div className="empty-message">
                      <Alert icon={false} color={"warning"}>
                          This account doesn't have any created assets
                      </Alert>
                  </div> : ''}
              <div className="assets">
                  <Grid container spacing={2}>
                      {createdAssets.map((asset) => {
                          return (<Grid item xs={12} sm={4} md={4} lg={4} xl={4} key={asset.index}>

                              <Card className={classes.customCard + ' asset'}>
                                  <CardHeader
                                      action={
                                          <div>
                                              <IconButton onClick={(ev) => {
                                                  setState(prevState => ({ ...prevState, menuAnchorEl: ev.target}));
                                                  dispatch(setSelectedAsset(asset));
                                              }}>
                                                  <MenuIcon />
                                              </IconButton>
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
                                      <Grid container spacing={2}>

                                          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                              <div className="params">
                                                  <div className="param">
                                                      <div className={"key"}>{getAssetBalWithTicker(asset, information)}</div>
                                                      <div className="value">

                                                      </div>
                                                  </div>
                                                  {renderAssetParam("Manager", asset.params.manager, information.address)}
                                                  {renderAssetParam("Reserve", asset.params.reserve, information.address)}
                                                  {renderAssetParam("Freeze", asset.params.freeze, information.address)}
                                                  {renderAssetParam("Clawback", asset.params.clawback, information.address)}
                                              </div>
                                          </Grid>
                                      </Grid>

                                  </CardContent>
                                  <CardActions className="card-action-custom">
                                      <div className="url">
                                          {asset.params.url ? <a href={asset.params.url} target="_blank">{asset.params.url}</a> : '[Empty asset url]'}

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
              <MenuItem onClick={() => {
                  dispatch(setAction('send'));
                  closeMenu();
              }}>
                  <Send className="asset-action-icon" fontSize={"small"}></Send>
                  Send assets
              </MenuItem>
              <MenuItem onClick={() => {
                  dispatch(setAction('modify'));
                  closeMenu();
              }}>
                  <Edit className="asset-action-icon" fontSize={"small"}></Edit>
                  Modify asset
              </MenuItem>
              <MenuItem onClick={() => {
                  dispatch(setAction('freeze'));
                  closeMenu();
              }}>
                  <Lock className="asset-action-icon" fontSize={"small"}></Lock>
                  Freeze / Unfreeze
              </MenuItem>
              <MenuItem onClick={() => {
                  dispatch(setAction('revoke'));
                  closeMenu();
              }}>
                  <SwapCalls className="asset-action-icon" fontSize={"small"}></SwapCalls>
                  Revoke assets
              </MenuItem>
              <MenuItem onClick={() => {
                  dispatch(setAction('delete'));
                  closeMenu();
              }}>
                  <Delete className="asset-action-icon" fontSize={"small"}></Delete>
                  Delete asset
              </MenuItem>
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

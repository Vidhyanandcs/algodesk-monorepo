import './Assets.scss';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {Grid, Card, CardHeader, IconButton, makeStyles, CardContent, Button, MenuItem, Menu} from "@material-ui/core";
import {Alert} from '@material-ui/lab';
import {Add, Menu as MenuIcon} from '@material-ui/icons';
import {getCommonStyles} from "../../utils/styles";
import {getAssetBalWithTicker, openAccountInExplorer, openAssetInExplorer} from "../../utils/core";
import {ellipseAddress} from "@algodesk/core";
import {useState} from "react";
import {setSelectedAsset, setAction} from '../../redux/actions/assetActions';
import SendAssets from "../SendAssets/SendAssets";
import CreateAsset from "../CreateAsset/CreateAsset";
import ModifyAsset from "../ModifyAsset/ModifyAsset";
import DeleteAsset from "../DeleteAsset/DeleteAsset";

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
                          return (<Grid item xs={12} sm={6} md={6} lg={6} xl={6} key={asset.index}>

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

                                          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                              <div className="params">
                                                  {renderAssetParam("Manager", asset.params.manager, information.address)}
                                                  {renderAssetParam("Reserve", asset.params.reserve, information.address)}
                                                  {renderAssetParam("Freeze", asset.params.freeze, information.address)}
                                                  {renderAssetParam("Clawback", asset.params.clawback, information.address)}
                                              </div>
                                          </Grid>
                                          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                              <div className="params">
                                                  <div className="param">
                                                      <div className="key">Balance</div>
                                                      <div className="value">{getAssetBalWithTicker(asset, information)}</div>
                                                  </div>
                                                  <div className="param">
                                                      <div className="key">Url</div>
                                                      <div className="value">{asset.params.url ? <a
                                                          target="_blank"
                                                          href={asset.params.url}
                                                          rel="noreferrer"
                                                          className={classes.primaryText}
                                                      >{asset.params.url}</a> : '(None)'}</div>
                                                  </div>
                                                  <div className="param">
                                                      <div className="key">Decimals</div>
                                                      <div className="value">{asset.params.decimals}</div>
                                                  </div>
                                              </div>
                                          </Grid>
                                      </Grid>

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
              <MenuItem onClick={() => {
                  dispatch(setAction('send'));
                  closeMenu();
              }}>Send assets</MenuItem>
              <MenuItem onClick={() => {
                  dispatch(setAction('modify'));
                  closeMenu();
              }}>Modify asset</MenuItem>
              <MenuItem onClick={() => {
                  dispatch(setAction('delete'));
                  closeMenu();
              }}>Delete asset</MenuItem>
          </Menu>
          <SendAssets></SendAssets>
          <CreateAsset></CreateAsset>
          <ModifyAsset></ModifyAsset>
          <DeleteAsset></DeleteAsset>
      </div>
  );
}

export default Assets;

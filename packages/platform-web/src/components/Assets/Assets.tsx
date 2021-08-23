import './Assets.scss';
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {Grid, Card, CardHeader, IconButton, makeStyles, CardContent, Button} from "@material-ui/core";
import {Alert} from '@material-ui/lab';
import {ArrowRightAlt, Add} from '@material-ui/icons';
import {getCommonStyles} from "../../utils/styles";
import {getAmountInDecimals, openAccountInExplorer, openAssetInExplorer} from "../../utils/core";
import {ellipseAddress} from "@algodesk/core";
import algosdk from "../../utils/algosdk";

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

function Assets(): JSX.Element {

    const account = useSelector((state: RootState) => state.account);
    const {information} = account;
    const createdAssets = algosdk.algodesk.accountClient.getCreatedAssets(information);
    const classes = useStyles();

  return (
      <div className="assets-wrapper">
          <div className="assets-container">
              <div className="title">
                  My Assets
                  {/*<span className="add-asset">*/}
                  {/*  <Fab color="primary" size={"small"} variant={"extended"} style={{paddingRight: 20}}>*/}
                  {/*    <Add/>*/}
                  {/*    Create*/}
                  {/*  </Fab>*/}
                  {/*</span>*/}
              </div>
              <Button
                  color="primary"
                  startIcon={<Add></Add>}
                  variant={"contained"}
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
                                              <IconButton color={"primary"} onClick={() => {

                                              }}>
                                                  <ArrowRightAlt />
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
                                                      <div className="value">{getAmountInDecimals(algosdk.algodesk.accountClient.balanceOf(asset.index, information) / Math.pow(10, asset.params.decimals), asset.params.decimals)} {asset.params['unit-name']}</div>
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
      </div>
  );
}

export default Assets;

import './Assets.scss';
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {Grid, Card, CardHeader, IconButton, makeStyles, CardContent, Button} from "@material-ui/core";
import {Alert} from '@material-ui/lab';
import {ArrowRightAlt, Add} from '@material-ui/icons';
import {getCommonStyles} from "../../utils/styles";
import {openAccountUrl} from "../../redux/utils";


const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        customDialog: {
            position: "absolute",
            top: 100
        }
    }
});

function Assets(): JSX.Element {

    const account = useSelector((state: RootState) => state.account);
    const {information} = account;
    const createdAssets = information["created-assets"];
    const classes = useStyles();
  return (
      <div className="assets-wrapper">
          <div className="assets-container">
              <div className="title">My Assets</div>
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
                          return (<Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={asset.index}>

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
                                          <span className='asset-name'>{asset.params.name}</span>
                                          <div className={classes.primaryText + ' asset-id'}>ID: {asset.index}</div>
                                      </div>}
                                      subheader=""
                                      variant="outlined"
                                  />
                                  <CardContent>
                                      <div className="params">
                                          <div className="param">
                                              <div className="key">
                                                  Manager
                                              </div>
                                              <div className="value clickable" onClick={() => {
                                                  openAccountUrl(asset.params.manager);
                                              }}>
                                                  {asset.params.manager}
                                              </div>
                                          </div>
                                          <div className="param">
                                              <div className="key">
                                                  Reserve
                                              </div>
                                              <div className="value clickable" onClick={() => {
                                                  openAccountUrl(asset.params.reserve);
                                              }}>
                                                  {asset.params.reserve}
                                              </div>
                                          </div>
                                          <div className="param">
                                              <div className="key">
                                                  Freeze
                                              </div>
                                              <div className="value clickable" onClick={() => {
                                                  openAccountUrl(asset.params.freeze);
                                              }}>
                                                  {asset.params.freeze}
                                              </div>
                                          </div>
                                          <div className="param">
                                              <div className="key">
                                                  Clawback
                                              </div>
                                              <div className="value clickable" onClick={() => {
                                                  openAccountUrl(asset.params.clawback);
                                              }}>
                                                  {asset.params.clawback}
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
      </div>
  );
}

export default Assets;

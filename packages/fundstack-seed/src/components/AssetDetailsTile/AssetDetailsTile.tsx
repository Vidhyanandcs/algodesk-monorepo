import './AssetDetailsTile.scss';
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {makeStyles, Tab, Tabs, Tooltip} from "@material-ui/core";
import React, {useState} from "react";
import {ellipseAddress, formatNumWithDecimals} from "@algodesk/core";
import fundstackSdk from "../../utils/fundstackSdk";
import {InfoOutlined} from "@material-ui/icons";
import {getCommonStyles} from "../../utils/styles";
import algoLogo from '../../assets/images/algo-logo.png';

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        tabLabel: {
            fontSize: 16,
            lineHeight: 1,
            fontWeight: 600
        }
    };
});

interface AssetDetailsTileState{
    tab: string
}

const initialState: AssetDetailsTileState = {
    tab: "pool_information"
};

function AssetDetailsTile(): JSX.Element {
    const fundDetails = useSelector((state: RootState) => state.fund);
    const {fund} = fundDetails;
    const {asset} = fund;
    const {params} = asset;
    const {decimals} = params;
    const classes = useStyles();

    const [
        { tab },
        setState
    ] = useState(initialState);

  return (
      <div className="asset-details-tile-wrapper">
          <div className="asset-details-tile-container">
              <div className="data">
                  <Tabs value={tab} className="tabs" onChange={(event, newValue) => {
                      setState(prevState => ({ ...prevState, tab: newValue }));
                  }} indicatorColor="primary">
                      <Tab label="Pool information" value="pool_information" className={classes.tabLabel}/>
                      <Tab label="Asset information" value="asset_information" className={classes.tabLabel}/>
                  </Tabs>
                  {tab === 'pool_information' ? <div className="tab-content">
                      <div className="pair">
                          <div className="key">
                              Total allocation
                              <Tooltip title="Total assets sold in this sale">
                                  <InfoOutlined fontSize={"small"}></InfoOutlined>
                              </Tooltip>
                          </div>
                          <div className="value">{formatNumWithDecimals(fundstackSdk.fundstack.getTotalAllocationInDecimals(fund), decimals) + " " + fund.asset.params["unit-name"]}</div>
                      </div>
                      <div className="pair">
                          <div className="key">
                              Min allocation
                              <Tooltip title="Minimum allocation for each investor">
                                  <InfoOutlined fontSize={"small"}></InfoOutlined>
                              </Tooltip>
                          </div>
                          <div className="value">{formatNumWithDecimals(fundstackSdk.fundstack.getMinAllocationInDecimals(fund), decimals) + " " + fund.asset.params["unit-name"]}</div>
                      </div>
                      <div className="pair">
                          <div className="key">
                              Max allocation
                              <Tooltip title="Maximum allocation for each investor">
                                  <InfoOutlined fontSize={"small"}></InfoOutlined>
                              </Tooltip>
                          </div>
                          <div className="value">{formatNumWithDecimals(fundstackSdk.fundstack.getMaxAllocationInDecimals(fund), decimals) + " " + fund.asset.params["unit-name"]}</div>
                      </div>
                      <div className="pair">
                          <div className="key">
                              Success criteria
                              <Tooltip title="Fund raising is successful only if this percent of tokens are sold">
                                  <InfoOutlined fontSize={"small"}></InfoOutlined>
                              </Tooltip>
                          </div>
                          <div className="value">{fundstackSdk.fundstack.getSuccessCriteriaPercentage(fund)}%</div>
                      </div>
                      <div className="pair">
                          <div className="key">
                              Price
                          </div>
                          <div className="value">1 {fund.asset.params["unit-name"]} = {fundstackSdk.fundstack.getPrice(fund)}
                              <img src={algoLogo} alt="Algo" className="algo-logo"/>
                          </div>
                      </div>
                  </div> : ''}
                  {tab === 'asset_information' ? <div className="tab-content">
                      <div className="pair">
                          <div className="key">Asset ID</div>
                          <div className="value clickable" onClick={() => {
                              fundstackSdk.explorer.openAsset(fund.asset.index);
                          }}>{fund.asset.index}</div>
                      </div>
                      <div className="pair">
                          <div className="key">Name</div>
                          <div className="value">{fund.asset.params.name}</div>
                      </div>
                      <div className="pair">
                          <div className="key">Total supply</div>
                          <div className="value">{fundstackSdk.fundstack.algodesk.assetClient.getTotalSupplyWithTicker(asset)}</div>
                      </div>
                      <div className="pair">
                          <div className="key">Creator</div>
                          <div className="value clickable" onClick={() => {
                              fundstackSdk.explorer.openAccount(fund.asset.params.creator);
                          }}>{ellipseAddress(fund.asset.params.creator, 8)}</div>
                      </div>
                      <div className="pair">
                          <div className="key">Decimals</div>
                          <div className="value">{fund.asset.params.decimals}</div>
                      </div>
                  </div> : ''}
              </div>
          </div>
      </div>
  );
}

export default AssetDetailsTile;

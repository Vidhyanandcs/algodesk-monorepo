import './AssetDetailsTile.scss';
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {Tab, Tabs, Tooltip} from "@material-ui/core";
import React, {useState} from "react";
import {A_Asset, ellipseAddress} from "@algodesk/core";
import fundstackSdk from "../../utils/fundstackSdk";
import {InfoOutlined} from "@material-ui/icons";

interface AssetDetailsTileState{
    tab: string
}

const initialState: AssetDetailsTileState = {
    tab: "pool_information"
};

function getValueInAssetDecimalsWithTicker(value: number, asset: A_Asset): string {
    return (value / Math.pow(10, asset.params.decimals)) + " " + asset.params["unit-name"];
}

function AssetDetailsTile(): JSX.Element {
    const fundDetails = useSelector((state: RootState) => state.fund);
    const {fund} = fundDetails;

    const [
        { tab },
        setState
    ] = useState(initialState);

  return (
      <div className="asset-details-tile-wrapper">
          <div className="asset-details-tile-container">
                <div className="tile-name">Asset details</div>
              <div className="data">
                  <Tabs value={tab} className="tabs" onChange={(event, newValue) => {
                      setState(prevState => ({ ...prevState, tab: newValue }));
                  }} indicatorColor="primary">
                      <Tab label="Pool information" value="pool_information"/>
                      <Tab label="Asset information" value="asset_information"/>
                  </Tabs>
                  {tab === 'pool_information' ? <div className="tab-content">
                      <div className="pair">
                          <div className="key">
                              Total allocation
                              <Tooltip title="Total assets sold in this sale">
                                  <InfoOutlined fontSize={"small"}></InfoOutlined>
                              </Tooltip>
                          </div>
                          <div className="value">{fundstackSdk.fundstack.getTotalAllocationInDecimals(fund) + " " + fund.asset.params["unit-name"]}</div>
                      </div>
                      <div className="pair">
                          <div className="key">
                              Min allocation
                              <Tooltip title="Minimum allocation for each investor">
                                  <InfoOutlined fontSize={"small"}></InfoOutlined>
                              </Tooltip>
                          </div>
                          <div className="value">{fundstackSdk.fundstack.getMinAllocationInDecimals(fund) + " " + fund.asset.params["unit-name"]}</div>
                      </div>
                      <div className="pair">
                          <div className="key">
                              Max allocation
                              <Tooltip title="Maximum allocation for each investor">
                                  <InfoOutlined fontSize={"small"}></InfoOutlined>
                              </Tooltip>
                          </div>
                          <div className="value">{fundstackSdk.fundstack.getMaxAllocationInDecimals(fund) + " " + fund.asset.params["unit-name"]}</div>
                      </div>
                      <div className="pair">
                          <div className="key">
                              Price
                          </div>
                          <div className="value">1 {fund.asset.params["unit-name"]} = {fundstackSdk.fundstack.getPrice(fund)} Algos</div>
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
                          <div className="value">{getValueInAssetDecimalsWithTicker(fund.asset.params.total, fund.asset)}</div>
                      </div>
                      <div className="pair">
                          <div className="key">Creator</div>
                          <div className="value clickable" onClick={() => {
                              fundstackSdk.explorer.openAccount(fund.asset.params.creator);
                          }}>{ellipseAddress(fund.asset.params.creator, 8)}</div>
                      </div>
                  </div> : ''}
              </div>
          </div>
      </div>
  );
}

export default AssetDetailsTile;

import './Settings.scss';
import {FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@material-ui/core";
import {useState} from "react";
import {getNetwork, setNetwork as selectNetwork} from "../../utils/common";

function Settings(): JSX.Element {
    const [network, setNetwork] = useState(getNetwork());

  return (
      <div className="settings-wrapper">
          <div className="settings-container">
              <FormControl component="fieldset">
                  <FormLabel component="legend">Select network</FormLabel>
                  <RadioGroup row value={network} onChange={(ev) => {
                      const network = ev.target.value;
                      setNetwork(network);
                      selectNetwork(network);
                  }}>
                      <FormControlLabel value="testnet" control={<Radio color="primary"/>} label="TestNet" />
                      <FormControlLabel value="betanet" control={<Radio color="primary"/>} label="BetaNet" />
                      <FormControlLabel value="mainnet" control={<Radio color="primary"/>} label="MainNet" />
                  </RadioGroup>
              </FormControl>
          </div>
      </div>
  );
}

export default Settings;

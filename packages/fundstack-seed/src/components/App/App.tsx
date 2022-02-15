import React, {useEffect} from 'react';
import './App.scss';
import AppRouter from './AppRouter';
import AppSnackbar from "./AppSnackbar";
import ConnectWallet from "../ConnectWallet/ConnectWallet";
import {setNetwork} from '../../redux/actions/network';
import {useDispatch} from "react-redux";
import Loader from "../Loader/Loader";
import {NETWORKS} from "@algodesk/core";
import SuccessModal from "../SuccessModal/SuccessModal";
import {setSigner} from "../../redux/actions/signer";
import fSdk from "../../utils/fSdk";
import {loadAccount} from "../../redux/actions/account";
import {REACT_APP_NETWORK} from "../../env";

function App(): JSX.Element {
    const dispatch = useDispatch();

    useEffect(() => {
        const selectedNetwork = REACT_APP_NETWORK || NETWORKS.MAINNET;
        dispatch(setNetwork(selectedNetwork));
        const selectedSigner = localStorage.getItem("signer");
        const selectedAddress = localStorage.getItem("address");
        if(selectedSigner && selectedAddress) {
            dispatch(setSigner(selectedSigner));
            fSdk.changeSigner(selectedSigner);
            dispatch(loadAccount(selectedAddress));
        }
    });

  return (
      <div className="app-root">
          <AppRouter></AppRouter>
          <AppSnackbar></AppSnackbar>
          <ConnectWallet></ConnectWallet>
          <Loader></Loader>
          <SuccessModal></SuccessModal>
      </div>
  );
}

export default App;

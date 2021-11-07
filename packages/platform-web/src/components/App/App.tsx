import React, {useEffect} from 'react';
import './App.scss';
import AppRouter from './AppRouter';
import AppSnackbar from "./AppSnackbar";
import ConnectWallet from "../ConnectWallet/ConnectWallet";
import {setNetwork} from '../../redux/actions/network';
import {useDispatch} from "react-redux";
import Loader from "../Loader/Loader";
import {getLocalNetwork, NETWORKS} from "@algodesk/core";

const networkEnv: string = process.env.REACT_APP_NETWORK;

function App(): JSX.Element {
    const dispatch = useDispatch();

    useEffect(() => {
        const selectedNetwork = getLocalNetwork() || networkEnv || NETWORKS.MAINNET;
        dispatch(setNetwork(selectedNetwork));
    });

  return (
      <div className="app-root">
          <AppRouter></AppRouter>
          <AppSnackbar></AppSnackbar>
          <ConnectWallet></ConnectWallet>
          <Loader></Loader>
      </div>
  );
}

export default App;

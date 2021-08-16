import React from 'react';
import './App.css';
import {NETWORKS} from '@algodesk/core';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {NETWORKS.MAINNET}
        </a>
      </header>
    </div>
  );
}

export default App;

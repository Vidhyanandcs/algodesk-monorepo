import React from 'react';
import './App.scss';
import Header from "../Header/Header";
import Body from "../Body/Body";


function App(): JSX.Element {
  return (
      <div className="app-root">
          <Header></Header>
          <Body></Body>
      </div>
  );
}

export default App;

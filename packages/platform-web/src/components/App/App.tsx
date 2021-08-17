import React from 'react';
import './App.scss';
import {Button} from "@material-ui/core";

function App() {
  return (
      <div className="app-root">
          <Button color={"primary"} variant={"outlined"}>Save</Button>
          <Button color={"secondary"}>cancel</Button>
      </div>
  );
}

export default App;

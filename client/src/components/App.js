import { Switch, Route } from "react-router-dom";
import React, { Fragment } from "react";
import Header from "./Header";
import Pets from "../pages/Pets";
import { ModalProvider } from "../hooks/useModalManager";

const App = () => (
  <Fragment>
    <Header />
    <div>
      <ModalProvider>
        <Switch>
          <Route exact path="/" component={Pets} />
        </Switch>
      </ModalProvider>
    </div>
  </Fragment>
);

export default App;

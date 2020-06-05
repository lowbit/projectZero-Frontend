import React, { Component, Fragment } from "react";
import TierList from "../games/TierList";

class GameHome extends Component {
  constructor() {
    super();
    this.state = {
      tierlists: []
    };
  }
  render() {
    return (
      <Fragment>
        <TierList />
      </Fragment>
    );
  }
}

export default GameHome;

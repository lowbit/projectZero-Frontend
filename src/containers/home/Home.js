import React, { Component, Fragment } from "react";
import GameList from "../games/GameList";

const headerTitle = {
  pageTitle: "Project Zero"
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.props.setHeader(headerTitle);
  }
  render() {
    return (
      <Fragment>
        <GameList />
      </Fragment>
    );
  }
}

export default Home;

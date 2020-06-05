/* eslint-disable no-console */
import React, { Component, Fragment } from "react";
import axios from "axios";
import GameCard from "../../components/GameCard";

const h1Style = {
  color: "#fff"
};

const title = {
  pageTitle: "Game List"
};
class GameList extends Component {
  constructor() {
    super();
    this.game = {
      title: "",
      description: "",
      releaseDate: "",
      imgPath: ""
    };
    this.state = {
      games: []
    };
  }
  async componentDidMount() {
    await axios
      .get(process.env.REACT_APP_API_URL + "/getGames")
      .then(response => {
        this.setState({
          games: response.data.games,
          isLoading: false,
          error: false
        });
      })
      .catch(error => {
        if (error.response) console.error(error.response.data);
        this.setState({
          error: true
        });
      });
  }

  render() {
    const games = this.state.games;
    return (
      <Fragment>
        <h1 style={h1Style}>{title.pageTitle}:</h1>
        <div>
          {games.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </Fragment>
    );
  }
}

export default GameList;

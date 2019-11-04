import React, { Component } from "react";
import { format } from "date-fns";

class GameCard extends Component {
  constructor() {
    super();
    this.state = {
      game: {},
      cursor: "",
      backgroundImageLocation: ""
    };
  }
  async componentDidMount() {
    this.setState({
      game: this.props.game,
      cursor: "default",
      backgroundImageLocation: `${process.env.REACT_APP_API_URL}${this.props.game.imgPath}`,
      formattedDate: format(new Date(this.props.game.releaseDate), "yyyy-MM-dd")
    });
  }
  onMouseEnter() {
    this.setState({
      cursor: "pointer"
    });
  }

  onMouseLeave() {
    this.setState({
      cursor: "default"
    });
  }
  render() {
    const gameCardBG = {
      color: "white",
      cursor: this.state.cursor,
      backgroundColor: `#222`,
      backgroundPosition: "center",
      backgroundImage: this.state.backgroundImage
    };
    const { game, formattedDate } = this.state;
    return (
      <div
        key={game.id}
        style={gameCardBG}
        onMouseEnter={() => this.onMouseEnter()}
        onMouseLeave={() => this.onMouseLeave()}
      >
        <img
          alt={game.title}
          src={this.state.backgroundImageLocation}
          height="240px"
        ></img>
        <h2>{game.title}</h2>
        <p>{game.description}</p>
        <p>{formattedDate}</p>
      </div>
    );
  }
}
export default GameCard;

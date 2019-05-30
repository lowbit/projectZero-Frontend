import React, { Component } from 'react';
import Moment from 'react-moment';

class GameCard extends Component {
    constructor() {
      super();
      this.state = {
          game:{},
          cursor:'',
          backgroundImage:``
      };
    }
    async componentDidMount(){
        this.setState({
            game:this.props.game,
            cursor:'default',
            backgroundImage:`linear-gradient(
                rgba(0, 0, 0, 0.5), 
                rgba(0, 0, 0, 0.5)
              ),url(${process.env.REACT_APP_API_URL}${this.props.game.imgPath})`
        })
    }
    onMouseEnter() {
        this.setState({
            cursor:'pointer',
            backgroundImage:`linear-gradient(
                rgba(0, 0, 0, 0.3), 
                rgba(0, 0, 0, 0.3)
              ),url(${process.env.REACT_APP_API_URL}${this.props.game.imgPath})`
        })
    }
    
    onMouseLeave() {
        this.setState({
            cursor:'default',
            backgroundImage:`linear-gradient(
                rgba(0, 0, 0, 0.5), 
                rgba(0, 0, 0, 0.5)
              ),url(${process.env.REACT_APP_API_URL}${this.props.game.imgPath})`
        })
    }
    render() {
        const gameCardBG = {
            color: 'white',
            height:'200px',
            cursor:this.state.cursor,
            backgroundColor: `#222`,
            backgroundPosition:'center',
            backgroundImage: this.state.backgroundImage
            };
        const game = this.state.game;
      return (
        <div key={game.id} style={gameCardBG}
        onMouseEnter={() => this.onMouseEnter()} onMouseLeave={() => this.onMouseLeave()}>
          <h2>{game.title}</h2>
          <p>{game.description}</p>
          <p><Moment format="DD.MMMM YYYY">{game.releaseDate}</Moment></p>
        </div>
      );
    }
  }
export default GameCard;
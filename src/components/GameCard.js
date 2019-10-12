import React, { Component } from 'react';
import { format } from 'date-fns'

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
            backgroundImageLocation: `${process.env.REACT_APP_API_URL}${this.props.game.imgPath}`,
            backgroundImage:`linear-gradient(
                rgba(0, 0, 0, 0.5), 
                rgba(0, 0, 0, 0.5)
              ),url(${process.env.REACT_APP_API_URL}${this.props.game.imgPath})`,
              formattedDate: format(new Date(this.props.game.releaseDate), "yyyy-MM-dd")
        })
    }
    onMouseEnter() {
        this.setState({
            cursor:'pointer',
            backgroundImage:`linear-gradient(
                rgba(0, 0, 0, 0.3), 
                rgba(0, 0, 0, 0.3)
              ),url(${this.state.backgroundImageLocation})`
        })
    }
    
    onMouseLeave() {
        this.setState({
            cursor:'default',
            backgroundImage:`linear-gradient(
                rgba(0, 0, 0, 0.5), 
                rgba(0, 0, 0, 0.5)
              ),url(${this.state.backgroundImageLocation})`
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
        const { game,formattedDate } = this.state;
      return (
        <div key={game.id} style={gameCardBG}
        onMouseEnter={() => this.onMouseEnter()} onMouseLeave={() => this.onMouseLeave()}>
          <h2>{game.title}</h2>
          <p>{game.description}</p>
          <p>{formattedDate}</p>
        </div>
      );
    }
  }
export default GameCard;
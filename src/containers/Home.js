import React from 'react';
import {
  HeaderBar
} from '../components';
import GameList from '../containers/games/GameList';

const title = {
  pageTitle: 'Project Zero',
};

const Home = () => (
  <div className="home-page">
    <HeaderBar title={title} />
    <GameList />
  </div>
);

export default Home;
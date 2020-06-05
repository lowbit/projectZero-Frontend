import React, { Component, Fragment } from "react";
import { Switch } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import RouteWithParams from "../components/RouteWithParams";
import Home from "./home/Home";
import Login from "./user/Login";
import Profile from "./user/Profile";
import ResetPassword from "./user/ResetPassword";
import AdminHome from "./admin/AdminHome";
import GameEdit from "./admin/GameEdit";
import TierListEdit from "./admin/TierListEdit";

class Routes extends Component {
  render() {
    return (
      <Fragment>
        <Switch>
          <RouteWithParams
            exact
            path="/"
            component={Home}
            setHeader={e => this.props.setHeader(e)}
          />

          {/*User*/}
          <RouteWithParams
            exact
            path="/login"
            component={Login}
            setHeader={e => this.props.setHeader(e)}
          />
          <RouteWithParams
            exact
            path="/reset/:token"
            component={ResetPassword}
            setHeader={e => this.props.setHeader(e)}
          />
          <PrivateRoute
            exact
            path="/userProfile/:username"
            component={Profile}
            setHeader={e => this.props.setHeader(e)}
          />

          {/** Admin */}
          <PrivateRoute
            exact
            path="/admin"
            component={AdminHome}
            setHeader={e => this.props.setHeader(e)}
          />
          <PrivateRoute
            exact
            path="/gameEdit/:id?"
            component={GameEdit}
            setHeader={e => this.props.setHeader(e)}
          />
          <PrivateRoute
            exact
            path="/tierListEdit/:id?/:tierlistid?"
            component={TierListEdit}
            setHeader={e => this.props.setHeader(e)}
          />

          {/** Games */}
        </Switch>
      </Fragment>
    );
  }
}

export default Routes;

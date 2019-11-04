import React, { Component, Fragment } from "react";
import { Switch } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import RouteWithParams from "../components/RouteWithParams";
import Home from "./home/Home";
import Register from "./user/Register";
import Login from "./user/Login";
import Profile from "./user/Profile";
import UpdateProfile from "./user/UpdateProfile";
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";
import UpdatePassword from "./user/UpdatePassword";
import AdminHome from "./admin/AdminHome";
import GameEdit from "./admin/GameEdit";

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
            path="/register"
            component={Register}
            setHeader={e => this.props.setHeader(e)}
          />
          <RouteWithParams
            exact
            path="/reset/:token"
            component={ResetPassword}
            setHeader={e => this.props.setHeader(e)}
          />
          <RouteWithParams
            exact
            path="/forgotPassword"
            component={ForgotPassword}
            setHeader={e => this.props.setHeader(e)}
          />
          <PrivateRoute
            exact
            path="/userProfile/:username"
            component={Profile}
            setHeader={e => this.props.setHeader(e)}
          />
          <PrivateRoute
            exact
            path="/updateUser/:username"
            component={UpdateProfile}
            setHeader={e => this.props.setHeader(e)}
          />
          <PrivateRoute
            exact
            path="/updatePassword/:username"
            component={UpdatePassword}
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

          {/** Games */}
        </Switch>
      </Fragment>
    );
  }
}

export default Routes;

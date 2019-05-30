import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './containers/Home';
import Register from './containers/user/Register';
import Login from './containers/user/Login';
import Profile from './containers/user/Profile';
import UpdateProfile from './containers/user/UpdateProfile';
import ForgotPassword from './containers/user/ForgotPassword';
import ResetPassword from './containers/user/ResetPassword';
import UpdatePassword from './containers/user/UpdatePassword';
import AdminHome from './containers/admin/AdminHome';
import PrivateRoute from './components/PrivateRoute';
import GameEdit from './containers/admin/GameEdit';

const Routes = () => (
  <div>
    <Switch>
      <Route exact path="/" component={Home} />

      {/*User*/}
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/reset/:token" component={ResetPassword} />
      <Route exact path="/forgotPassword" component={ForgotPassword} />
      <PrivateRoute exact path="/userProfile/:username" component={Profile} />
      <PrivateRoute exact path="/updateUser/:username" component={UpdateProfile} />
      <PrivateRoute
        exact
        path="/updatePassword/:username"
        component={UpdatePassword}
      />
      {/** Admin */}
      <PrivateRoute exact path="/admin" component={AdminHome} />
      <PrivateRoute
        exact
        path="/gameEdit/:id?"
        component={GameEdit}
      />
      {/** Games */}
      
    </Switch>
  </div>
);

export default Routes;
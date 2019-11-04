import React from "react";
import { Route } from "react-router-dom";

const RouteWithParams = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => <Component {...props} {...rest} />} />
);
export default RouteWithParams;

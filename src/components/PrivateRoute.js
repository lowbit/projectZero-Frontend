import React from 'react'
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest}) =>(
    <Route {...rest} render={(props) => (
    localStorage.getItem('JWT') === null
    ? <Redirect to='/login' />
    : <Component {...props} />
    )} />
)
export default PrivateRoute;
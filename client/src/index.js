import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";


import AdminLayout from "layouts/Admin/Admin.js";

import "assets/scss/black-dashboard-react.scss";
import "assets/demo/demo.css";
import "assets/css/nucleo-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import Auth from './views/auth/Auth';
import VerifyAccount from './views/auth/VerifyAccount';
import ResetPassword from './views/auth/ResetPassword';
import ForgotPassword from './views/auth/ForgotPassword';

import ThemeContextWrapper from "./components/ThemeWrapper/ThemeWrapper";
import BackgroundColorWrapper from "./components/BackgroundColorWrapper/BackgroundColorWrapper";
import AuthContextProvider from './contexts/AuthContext';

ReactDOM.render(
  <div style={{width:"100%",maxWidth:"100vw",height:"100vh"}}>
    <AuthContextProvider>
    <ThemeContextWrapper>
      <BackgroundColorWrapper>  
        <BrowserRouter>
          <Switch>
            <Route exact path='/'> <Auth /> </Route>
            <Route path='/accountverify/:verifyToken'> <VerifyAccount /> </Route>
            <Route path='/forgotpassword'> <ForgotPassword /> </Route>
            <Route path='/passwordreset/:resetToken'> <ResetPassword /> </Route>
            <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
            <Redirect from="/" to="/admin/dashboard" />
          </Switch>
        </BrowserRouter>
      </BackgroundColorWrapper>
    </ThemeContextWrapper>
    </AuthContextProvider>
  </div>
  ,
  document.getElementById("root")
);

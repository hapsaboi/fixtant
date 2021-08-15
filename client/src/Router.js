import React from 'react';
import { BrowserRouter, Route, Switch,Redirect } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';


import AdminLayout from "layouts/Admin/Admin.js";
import Auth from './views/auth/Auth';
import VerifyAccount from './views/auth/VerifyAccount';
import ResetPassword from './views/auth/ResetPassword';
import ForgotPassword from './views/auth/ForgotPassword';

function RouterComp() {
    const { loggedIn } = useAuth();

    console.log(loggedIn);
    return (
        <BrowserRouter>
          <Switch>
              {!loggedIn?
                <>
                    <Route exact path='/'> <Auth /> </Route>       
                    <Route path='/accountverify/:verifyToken'> <VerifyAccount /> </Route>
                    <Route path='/forgotpassword'> <ForgotPassword /> </Route>
                    <Route path='/passwordreset/:resetToken'> <ResetPassword /> </Route>
                    <Route from="*" component={Auth} />
                </>
                :
                <>
                    <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
                    <Redirect from="/" to="/admin/dashboard" />
                </>
              }            
          </Switch>
        </BrowserRouter>
    )
}
export default RouterComp;



import React, { lazy, Suspense } from 'react';
// import { Outlet, Link, useRoutes, useParams, Route } from "react-router-dom";
import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";
import Layout from '../components/Layout';

const Login = lazy(() => import('../pages/login'));
const Reset = lazy(() => import('../pages/reset'));
const Registration = lazy(() => import('../pages/signup'))
const List = lazy(() => import('../pages/list'))
const Analysis = lazy(() => import('../pages/analysis'))
const SelectPackage = lazy(() => import('../pages/select-packeges'))
const Dashboard = lazy(() => import('../pages/exchange'))
const Workspace = lazy(() => import('../pages/workspace'))
const Exchange = lazy(() => import('../pages/exchange'))
const Profile = lazy(() => import('../pages/profile'))
const Savecontact = lazy(() => import('../pages/savecontact'))
const Users = lazy(() => import('../pages/users'))
const Searchlog = lazy(() => import('../pages/searchlog'))
const DownloadLog = lazy(() => import('../pages/downloadlog'))
const Subscriptions = lazy(() => import('../pages/subscriptions'))
const Indepth = lazy(() => import('../pages/indepth'))
const RelativePerformance= lazy(() => import('../pages/relativePerformance'))  
const DownloadLogNew = lazy(() => import('../pages/downloadlog'))
const List1 = lazy(() => import('../pages/list1'))
//const indepthTest = lazy(() => import('../pages/indepthTest'))
const NotFound = lazy(() => import('../pages/notfound'))

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => isAuthenticated() ? (
        <Component {...props} />
    ) : (
        <Redirect to={
            {
                pathname: '/login',
                state: {
                    form: props.location
                }
            }} />
    )} />
)

const isAuthenticated = () => {
    const sessionID = sessionStorage.getItem("userToken") && localStorage.getItem("sessionID");
    // console.log("sessionID ======= ", sessionID)
    return sessionID;

}

const Routes = () => {
    const loader = (
        <div className="page-loader-wrapper">
            <div className="page-loader"></div>
        </div>);
    return (
        <Suspense fallback={loader}>
            <BrowserRouter>
                <Switch>
                    <Route exact path={`/`} component={Login} />
                    <Route exact path={`/login`} component={Login} />
                    <Route exact path={`/signup`} component={Registration} />
                    <Route exact path={'/maintenance'} component={NotFound} />
                    <Route exact path={'/reset'} component={Reset} />
                    <Layout>
                        <Switch>
                            <PrivateRoute exact path="/list" component={List} />
                            <PrivateRoute exact path="/list1" component={List1} />
                            <PrivateRoute exact path="/analysis" component={Analysis} />
                            <PrivateRoute exact path={`/dashboard`} component={Dashboard} />
                            <PrivateRoute exact path={`/select-package`} component={SelectPackage} />
                            <PrivateRoute exact path={`/workspace`} component={Workspace} />
                            <PrivateRoute exact path={`/exchange`} component={Exchange} />
                            <PrivateRoute exact path={`/profile`} component={Profile} />
                            <PrivateRoute exact path={`/savecontact`} component={Savecontact} />
                            <PrivateRoute exact path={`/users`} component={Users} />
                            <PrivateRoute exact path={`/searchlog`} component={Searchlog} /> 
                            <PrivateRoute exact path={`/downloadlog`} component={DownloadLog} />
                           
                            <PrivateRoute exact path={`/subscriptions`} component={Subscriptions} />
                            <PrivateRoute exact path="/indepthAnalysis" component={Indepth} />
                            {/* <PrivateRoute exact path="/indepthTest" component={indepthTest} /> */}
                            <PrivateRoute exact path="/relativePerformance" component={RelativePerformance} />
                            <Redirect from="*" to="/maintenance" />
                        </Switch>
                    </Layout>
                </Switch>
            </BrowserRouter>
        </Suspense>
    )
}

export default Routes;
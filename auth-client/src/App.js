import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink, useHistory } from 'react-router-dom';
import TourList from './components/Tours.component';
import CreateTour from './components/Create.component';
import EditTour from './components/Edit.component';
import Login from './components/Login';
import apiClient, { logout_url } from './services/api';
import Cookies from 'js-cookie';
// import { useEffect } from "react";
// import { getTourItems } from "./reducers/tourSlice";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedIn, setLoggedOut} from './reducers/tourSlice';
import  './resources/app.scss';

const App = () => {
  const [page, setPage] = useState(1);
  const [tourItems, setTourItems] = useState([])
  const dispatch = useDispatch();
  
  
  // const counter = useSelector((state) => state.counter)
  const [loggedIn, setLoggedIn2] = React.useState( sessionStorage.getItem('loggedIn') === 'true' || false );
  
  const login = () => {
    setLoggedIn2(true);
    dispatch(setLoggedIn())
  };


  const logout = () => {
    apiClient.post(logout_url,[]).then(response => {
      if (response.status === 200) { //204
        Cookies.remove('access_token');
        setLoggedIn2(false);
        dispatch(setLoggedOut())
        
      }
    })
  };
  
  // const { tourItems, isLoading } = useSelector((store) => store.tours);import { useDispatch, useSelector } from "react-redux";
  // const dispatch = useDispatch();

  
  // useEffect(() => {
  //   if(loggedIn){
  //     dispatch(getTourItems());
  //   }
  // }, []);
  
  const authLink = loggedIn 
  ? <button onClick={logout} className="nav-link btn btn-link primary-text">Logout</button> 
  : <NavLink to='/login' className="nav-link">Login</NavLink>;
  return (
    <Router>
      <nav className="navbar navbar-expand-sm navbar-dark bg-primary primary-background fixed-top">
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink to='/' className="nav-link">Tours</NavLink>
            </li>
            <li className="nav-item">
              {authLink}
            </li>
          </ul>
        </div>
      </nav>
      <div className="container mt-5 pt-5">
        <Switch>
          <Route path='/' exact render={props => (
            <TourList {...props} loggedIn={loggedIn} history={useHistory} page={page} setPage={setPage} tourItems={tourItems} setTourItems={setTourItems}  />
          )} />
          <Route path='/login' render={props => (
            <Login {...props} login={login} />
          )} />
          <Route path='/tours/create' render={props => (
            <CreateTour history={useHistory} page={page} setPage={setPage}  />
          )} />
          <Route path='/tours/update/:id' render={props => (
            <EditTour {...props}  history={useHistory} page={page} setPage={setPage} tourItems={tourItems} setTourItems={setTourItems} props={[setTourItems]}/>
          )} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;

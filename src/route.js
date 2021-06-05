import React from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import App from './App';
import Navbar from './modules/Layouts/Navbar';
import Profile from './modules/UserProfile/Profile';

function MainRoute() {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path={'/'}>
					<App />
				</Route>
				<Route exact path={'/:uid'}>
					<Navbar/>
					<Profile />
				</Route>
				<Route path='*'>
					<Redirect to={'/'} />
				</Route>
			</Switch>
		</BrowserRouter>
	);
};

export default MainRoute;

import React, { useState, useEffect, createContext, useContext } from 'react';
import { authenticate } from '../data/api';
import Axios from 'axios';
import GridLoader from "react-spinners/GridLoader";

import { Redirect } from 'react-router-dom';

const AuthContext = createContext();
Axios.defaults.withCredentials = true;




export const useAuth = () => useContext(AuthContext);

function AuthContextProvider(props) {
	const [ loggedIn, setLoggedIn ] = useState(undefined);
	const [ isLoading, setIsLoading ] = useState(true);
	const [userDetail, setUserDetail] = useState({});

	async function getLoggedIn() {
		Axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
		const loggedInRes = await Axios.get(authenticate.loggedIn);

		if (loggedInRes.data.status===false) {
			window.localStorage.removeItem("token");
			setLoggedIn(false);
			<Redirect to="/" />;
		}else{
			setLoggedIn(loggedInRes.data);
		}
	}
	useEffect(
		() => {
			Axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
			Axios.get(authenticate.loggedIn).then((response) => {
				if (response.data.status===false) {
					window.localStorage.removeItem("token");
					setLoggedIn(false);
					<Redirect to="/" />;
				}else{
					//setting token to localStorage

					Axios.get(authenticate.getUserData).then((user)=>{
						setLoggedIn(response.data);
						setUserDetail(user.data);	
					});
					
				}
				setIsLoading(false);
			});
		},
		[  ]
	);
	if (isLoading) { 	 
		return (
			<div className="loaderDiv" style={{position: "absolute",top: "50%",left: "50%", transform: "translate(-50%, -50%)"}}>
				<GridLoader color={"white"} loading={true} size={40} />
			</div>
		);
	}
	else if(loggedIn!==undefined){
		return <AuthContext.Provider value={{ loggedIn, getLoggedIn,userDetail }}>{props.children}</AuthContext.Provider>;
	}
	else{
		return (
			<div className="loaderDiv" style={{position: "absolute",top: "50%",left: "50%", transform: "translate(-50%, -50%)"}}>
				<GridLoader color={"white"} loading={true} size={40} />
				<br />
				Waiting for Authentication...
			</div>
		);
	}
}

export default AuthContextProvider;

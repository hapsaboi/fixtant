import React, { useState, useEffect, createContext, useContext } from 'react';
import { authenticate } from '../data/api';
import Axios from 'axios';
import GridLoader from "react-spinners/GridLoader";

const AuthContext = createContext();
Axios.defaults.withCredentials = true;
export const useAuth = () => useContext(AuthContext);

function AuthContextProvider(props) {
	const [ loggedIn, setLoggedIn ] = useState(undefined);
	const [ isLoading, setIsLoading ] = useState(true);
	const [userDetail, setUserDetail] = useState({});

	async function getLoggedIn() {
		const loggedInRes = await Axios.get(authenticate.loggedIn);
		if (loggedInRes.data.reason==="Expired") {
			Axios.get(authenticate.logout);
		}else{
			setLoggedIn(loggedInRes.data);
		}
	}
	useEffect(
		() => {
			Axios.get(authenticate.loggedIn).then((response) => {
				if (response.data.reason==="Expired") {
					Axios.get(authenticate.logout);
					setLoggedIn(false);
				}else{
					Axios.get(authenticate.getUserData).then((user)=>{
						setLoggedIn(response.data);
						setUserDetail(user);	
					});
					
				}
				setIsLoading(false);
			});
		},
		[ loggedIn ]
	);
	if (isLoading) { 
		 
		return (
			<div className="loaderDiv" style={{position: "absolute",top: "50%",left: "50%", transform: "translate(-50%, -50%)"}}>
				<GridLoader color={"white"} loading={true} size={40} />
			</div>
		);
	}
	return <AuthContext.Provider value={{ loggedIn, getLoggedIn,userDetail }}>{props.children}</AuthContext.Provider>;
}

export default AuthContextProvider;

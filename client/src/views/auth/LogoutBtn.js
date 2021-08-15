import React from 'react';
import Axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useHistory } from 'react-router-dom';

function LogoutBtn() {
    const history = useHistory();
    const { getLoggedIn } = useAuth();
    async function logOut() {
        await Axios.get("http://localhost:5000/api/users/logout");
        await getLoggedIn();
        history.push('/');
    }
    return (
        <button onClick={logOut}> Logout</button>
    )
}

export default LogoutBtn

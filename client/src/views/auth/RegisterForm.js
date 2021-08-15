import React, { useState } from 'react';
import Axios from 'axios';
import { authenticate } from '../../data/api';

function Register() {
    const [name, setName] = useState('');
    const [store, setStore] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    async function register(e) {
        e.preventDefault();

        try {
            const registerData = { name, email, phone, store, password };
            const response = await Axios.post(authenticate.addUser, registerData);
            setMessage(response.data.msg + '.');
            setTimeout(() => {
                setMessage("");
            }, 5000);
        } catch (err) {
            setMessage(err.response.data.msg + '!');
            setTimeout(() => {
                setMessage("");
            }, 5000);
        }
        
    }
    return (
        <>
            <form className="sign-up-form" onSubmit={register}>
                <h2 className="title">Sign up</h2>
                <h4 style={{ color: 'red', textAlign: 'center' }}>{message}</h4>
                <div className="input-field">
                    <i><box-icon name='user' ></box-icon></i>
                    <input type="text" placeholder="Name ... John Doe" onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="input-field">
                    <i><box-icon name='store-alt' ></box-icon></i>
                    <input type="text" placeholder="Store Name: Hive Store" onChange={(e) => setStore(e.target.value)} />
                </div>
                <div className="input-field">
                    <i><box-icon name='envelope' ></box-icon></i>
                    <input type="email" placeholder="Email ... johndoe@aun.edu.ng" onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="input-field">
                    <i><box-icon name='phone' ></box-icon></i>
                    <input type="text" placeholder="Phone 090********" onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="input-field">
                    <i><box-icon name='lock' ></box-icon></i>
                    <input type="password" placeholder="Password" autoComplete='true' onChange={(e) => setPassword(e.target.value)} />
                </div>

                <input type="submit" className="btn-auth" value="Sign up" />
            </form>
        </>
    )
}

export default Register;

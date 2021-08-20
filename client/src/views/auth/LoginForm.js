import { useState } from 'react';
import Axios from 'axios';
import { useHistory, Link } from 'react-router-dom';
import logo from '../../assets/logo/White/Full White.svg';
import { authenticate } from '../../data/api';
import { BiEnvelope,BiReset } from "react-icons/bi";
import { BsFillLockFill } from "react-icons/bs";

function LoginForm({ getLoggedIn }) {
	const [ email, setEmail ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ message, setMessage ] = useState('');
	const history = useHistory();

	async function loginFunc(e) {
		e.preventDefault();
		let nemail = email.toLowerCase().replace(/ /g,'');
		const loginData = { email:nemail, password };

		try {
			const { data } = await Axios.post(authenticate.userAuth, loginData);
			if (data.auth === true) {
				window.localStorage.setItem('token', data.token);
				await getLoggedIn();
				history.push('/admin/dashboard');
			} else {
				setMessage(data.msg);
			}
		} catch (err) {
			setMessage(err.response.data.msg + '!');
		}
		
	}
	return (
		<>	
			
			<form onSubmit={loginFunc} className="sign-in-form">
				<img src={logo} alt="Fixtant Logo" style={{padding:"50px"}} />
				<h4 style={{ color: 'red', textAlign: 'center' }}>{message}</h4>
				<div className="input-field">
					<i>
						<BiEnvelope className="iconInput" />
					</i>
					<input
						type="text"
						placeholder="Email ... johndoe@gmail.com"
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div className="input-field">
					<i>
						<BsFillLockFill className="iconInput" />
					</i>
					<input
						type="password"
						placeholder="Password"
						autoComplete="true"
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<input type="submit" value="Login" className="btn-auth solid" />
				<p className="social-text" style={{color:'white'}}>Having Password issues?</p>
				<div className="social-media">
					<Link to="/forgotpassword">
						<i className="social-icon">
							<BiReset size={25} color="white"/>
						</i>
					</Link>
				</div>
			</form>
		</>
	);
}

export default LoginForm;

import { useState } from 'react';
import Axios from 'axios';
import { useHistory, Link } from 'react-router-dom';
import logo from '../../assets/logo/White/Full White.svg';
import { authenticate } from '../../data/api';

function LoginForm({ getLoggedIn }) {
	const [ email, setEmail ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ message, setMessage ] = useState('');
	const history = useHistory();

	async function loginFunc(e) {
		e.preventDefault();
		const loginData = { email, password };

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
						<box-icon name="envelope" />
					</i>
					<input
						type="text"
						placeholder="Email ... johndoe@gmail.com"
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div className="input-field">
					<i>
						<box-icon name="lock" />
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
							<box-icon name="reset" color="white" />
						</i>
					</Link>
				</div>
			</form>
		</>
	);
}

export default LoginForm;

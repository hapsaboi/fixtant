const express = require('express');
const router = express.Router();
const {addUser,editProfileChange} = require('../../utils/changes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../../utils/sendEmail');
const crypto = require('crypto');

const {auth} = require('../../middleware/auth');

// User Model
const Users = require('../../models/User');

let FrontEnd = "";
const port = process.env.PORT || process.env.LocalPort;
{process.env.LocalPort === port ? FrontEnd = process.env.FrontEndHost : FrontEnd = process.env.FrontEndHostProduction}


//@routes PUT api/user/editProfile
//@desc update user
//@response - status: true or false | error
router.patch('/edit_profile', auth, async (req, res) => {
	try {
        const user = await Users.findByIdAndUpdate(req.body._id,req.body);
		if (!user){res.status(400).send({status:false, error:'Problem with the update query'})};
		
		//add change to system
		const cresult = await editProfileChange(user,req.body);
		res.status(200).send({status:true, change:cresult});
        
	} catch (err) {
		res.json({ msg: err });
	}
});

//@routes POST api/users/register
//@desc Register new user
//@access public
router.post('/add_user', async (req, res) => {
	const { name, email, phone, password,store } = req.body;

	//Simple Validation
	if (!name || !email || !phone || !password ||!store) {
		res.status(400).send({ msg: 'Please enter all fields' });
	}else{
		try {
			user = await Users.findOne({ email });

			//if user already exist
			if (user) return res.status(400).send({ msg: 'User Already Exist' });

			//creating new user
			const newUser = new Users({ name, email, phone, password,store });

			//Create salt and hash
			const salt = await bcrypt.genSalt(10);

			newUser.password = await bcrypt.hash(req.body.password, salt);

			//     // res.json({
			//     //     token,
			//     //     user: {
			//     //         id: user.id,
			//     //         name: user.name,
			//     //         email: user.email,
			//     //         school_id: user.school_id,
			//     //         phone: user.phone
			//     //     }
			//     // });

			// })

			const verifyToken = crypto.randomBytes(20).toString('hex');
			newUser.tempToken = crypto.createHash('sha256').update(verifyToken).digest('hex');
			newUser.tempTokenExpire = Date.now() + 10 * (60 * 1000);

			const verifyUrl = `${FrontEnd}/accountverify/${verifyToken}`;

			const message = `
				<h1>Account created successfully<h1/>
				<p>Click this link to verify your account</p>
				<a href=${verifyUrl} clicktracking=off>${verifyUrl}</a>
			`;

			try {
				await sendEmail({
					to: newUser.email,
					subject: 'Welcome to Fixtant',
					text: message
				});
				newUser.save();
				return res
					.status(200)
					.send({ msg: 'Account created successfuly please go to your email to verify account!' });
			} catch (error) {
				newUser.tempToken = undefined;
				newUser.tempTokenExpire = undefined;
				await newUser.save();
				return res.status(500).send({ msg: 'Email could not be sent!' });
			}
		} catch (err) {
			res.status(400).json({ msg: err });
		}
	}

	
});

//@routes GET api/user/loggedIn
//@desc Check if a user is loggedIn
router.get('/loggedIn', async (req, res) => {
	try {
		const token = req.headers.authorization;
		//check for token
		if (!token) {
			res.status(200).send(false);
		}else{
            jwt.verify(token, process.env.jwtSecret, function(err) {
                if (err) {res.status(200).send({status:false});}
                else{res.status(200).send(true)};
            })
            
        }
		//verify token

	} catch (e) {
		res.status(501).send(e);
	}
});


//@routes GET api/users/logout
//@desc Logout a user
router.get('/logout', async (req, res) => {
	res
		.cookie('token', '', 
		{
			httpOnly: true,
			expires: new Date(0)
		})
		.send();
});

//@routes GET api/users/forgotPassword
//@desc Reset user password
router.post('/forgotPassword', async (req, res) => {
	const { email } = req.body;

	const user = await Users.findOne({ email });

	try {
		if (!user) {
			return res.status(400).send({ msg: 'Email could not be sent!' });
		}

		const resetToken = crypto.randomBytes(20).toString('hex');

		user.tempToken = crypto.createHash('sha256').update(resetToken).digest('hex');
		user.tempTokenExpire = Date.now() + 10 * (60 * 1000);

		await user.save();

		const resetUrl = `${FrontEnd}/passwordreset/${resetToken}`;

		const message = `
            <h1>You have requested a password reset<h1/>
            <p>Please go to this link to reset your password</p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `;
		try {
			await sendEmail({
				to: user.email,
				subject: 'Password Reset Request',
				text: message
			});
			res.status(200).send({ msg: 'Email Sent' });
		} catch (error) {
			Users.tempToken = undefined;
			Users.tempTokenExpire = undefined;
			await User.save();

			return res.status(500).send({ msg: 'Email could not be sent!' });
		}
	} catch (error) {
		return res.status(500).send({ msg: error });
	}
});

//@routes PUT api/users/passwordReset
//@desc Reset user password
router.put('/passwordReset/:resetToken', async (req, res) => {
	const tempToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

	try {
		const user = await Users.findOne({
			tempToken,
			tempTokenExpire: { $gt: Date.now() }
		});
		if (!user) {
			return res.status(400).send({ msg: 'Invalid Reset Token!' });
		}
		const salt = await bcrypt.genSalt(10);

		user.password = await bcrypt.hash(req.body.password, salt);
		user.tempToken = undefined;
		user.tempTokenExpire = undefined;

		await user.save();
		res.status(201).send({
			success: true,
			msg: 'Password Reset Successful'
		});
	} catch (error) {
		return res.status(500).send({ msg: error });
	}
});

//@routes PUT api/users/verifyAccount
//@desc Verifying registered account
router.put('/verifyAccount/:verifyToken', async (req, res) => {
	const tempToken = crypto.createHash('sha256').update(req.params.verifyToken).digest('hex');

	try {
		const user = await Users.findOne({
			tempToken,
			tempTokenExpire: { $gt: Date.now() }
		});

		if (!user) {
			return res
				.status(401)
				.send({ msg: 'Invalid verification token, try logging in to get another token!', status: false });
		}

		user.status = 'verified';
		user.tempToken = undefined;
		user.tempTokenExpire = undefined;

		await user.save();
        addUser(user);
		return res.status(201).send({ msg: 'Account Verified', status: true });
	} catch (error) {
		return res.status(500).send({ msg: 'Server error please try again!', status: false });
	}
});

module.exports = router;
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const crypto = require('crypto');
// Users Model
const User = require('../../models/User');
// getting the auth middleware
const {auth} = require('../../middleware/auth');
const sendEmail = require('../../utils/sendEmail');


let FrontEnd = "";
const port = process.env.PORT || process.env.LocalPort;
{process.env.LocalPort === port ? FrontEnd = process.env.FrontEndHost : FrontEnd = process.env.FrontEndHostProduction}

//@routes POST api/auth
//@desc Authenticate user
//@access Public
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    //Simple Validation
    if (!email || !password) {
        return res.status(401).send({ msg: 'Please enter all fields', auth: false });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).send({ msg: 'User Does Not Exist', auth: false });

        if (user.status === 'not verified') {

            const verifyToken = crypto.randomBytes(20).toString("hex");
            user.tempToken = crypto.createHash("sha256").update(verifyToken).digest("hex");
            user.tempTokenExpire = Date.now() + 10 * (60 * 1000);

            const verifyUrl = `${FrontEnd}/accountverify/${verifyToken}`;

            const message = `
                                <h1>Account Verification<h1/>
                                <p>Click this link to verify your account</p>
                                <a href=${verifyUrl} clicktracking=off>${verifyUrl}</a>
                            `;

            try {
                await sendEmail({
                    to: user.email,
                    subject: 'Welcome to Fixtant',
                    text: message
                });
                await user.save();

                return res.status(201).send({
                    msg:
                        'Account not verified, a new verification email sent, please use it to verify your account',
                    auth: false
                });
            } catch (error) {
                user.tempToken = undefined;
                user.tempTokenExpire = undefined;
                await user.save();
                console.log(error);
                return res.status(500).send({ msg: 'Account not verified, a new verification email sent, email could not be sent. Please contact admin!' });
            }

        }

        //Validating Password
        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if (!isMatch) {
                    return res.status(401).send({ msg: 'Invalid Credentails', auth: false })
                };
                //isMatch is true 
                jwt.sign(
                    { id: user.id },
                    process.env.jwtSecret,
                    { expiresIn: 86400 },
                    (err, token) => {
                        if (err) throw err;
                        // res.json({
                        //     token,
                        //     user: {
                        //         id: user.id,
                        //         name: user.name,
                        //         email: user.email,
                        //         school_id: user.school_id,
                        //         phone: user.phone
                        //     }
                        // });
                        res.status(200).send({ 'auth': true, token });
                    }
                )
            })

    } catch (err) {
        res.status(400).json({ msg: err, auth: false })
    }
});


//@routes GET api/auth/user
//@desc Get user data
//@access Private
router.get('/user', auth, (req, res) => {
    User.findById(req.user.id)
        .select('name store email')
        .then(user => res.json(user))
});


module.exports = router; 

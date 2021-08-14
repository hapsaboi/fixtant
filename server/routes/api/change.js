const express = require('express');
const router = express.Router();


const {auth} = require('../../middleware/auth');

// Change Model
const Changes = require('../../models/Changes');

// Note changes are being created by mostly products and the fuctions are in the products.js file(route)


//@routes GET api/show_changes/
//@desc Get all 
//@response - status: true or false | data | error
router.get('/show_changes', auth, async (req, res) => {
	let store = req.user.id;
	const change = await Changes.find({store});
	try {	
		if (!change){res.status(400).send({status:false, error:'Problem with the query'})};
		res.status(200).send({status:true,data:change});
        
	} catch (err) {
		res.status(400).json({ msg: err });
	}
});


module.exports = router;
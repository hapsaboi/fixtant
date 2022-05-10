const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const {addStaff,updateStaffChange} = require('../../utils/changes');
const {auth} = require('../../middleware/auth');
// Staff Model
const Staffs = require('../../models/Staff');

//@routes POST api/add_staff/
//@desc create a staff
//@response - status: true or false
// {
//     "staff_name":"Tecno Camon CX",
//     "staff_desc":"This staff is a staff",
//     "status":"true",
//     "brand":"Tecno",
//     "variations":[{"variation":"Black-64GB","buying_price":10000,"selling_price":20000}],
//     "store":"Hanis Store"
// }

router.post('/add_staff', auth, async(req,res)=>{
	const store = req.user.id;
    const newStaff = new Staffs({...req.body,store});

	const salt = await bcrypt.genSalt(10);
	newStaff.password = await bcrypt.hash(req.body.password, salt);

    try{
        const staff = await newStaff.save();
        if(staff){
			const change = addStaff(newStaff);
            res.status(200).send({'status':true, message:change.message});
        }else{
            res.json({'status':false,'reason':"Error Creating Staff"});
        }
    }catch(err){
        res.json({'status':false, 'reason':"Server Error"});;
    }

});


//@routes GET api/show_store_staffs/
//@desc Get all 
//@response - status: true or false | data | error
router.get('/show_store_staff', auth, async (req, res) => {
	const store = req.user.id;
	const staffs = await Staffs.find({store}).select('-password');
	try {
		if (!staffs){res.status(400).send({status:false, error:'Problem with the query'})};
		res.status(200).send({status:true,data:staffs});
        
	} catch (err) {
		res.status(400).json({ msg: err });
	}
});


//@routes PUT api/update_staff/
//@desc update staff 
//@response - status: true or false | error
router.patch('/update_staff', auth, async (req, res) => {
	try {
		let update = req.body;

		if(update.upassword){
			const salt = await bcrypt.genSalt(10);
			update.password = await bcrypt.hash(update.upassword, salt);

		}
		
        const staffs = await Staffs.findByIdAndUpdate(req.body._id,req.body);

		if (!staffs){res.status(400).send({status:false, error:'Problem with the update query'})};
		
		//add change to system
		const cresult = await updateStaffChange(staffs,req.body);
		res.status(200).send({status:true, change: cresult});
        
	} catch (err) {
		console.log(err);
		res.status(400).json({ msg: err });
	}
});



module.exports = router;
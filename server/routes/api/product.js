const express = require('express');
const router = express.Router();
const {addProduct,updateProductChange} = require('../../utils/changes');
const {auth} = require('../../middleware/auth');
// Product Model
const Products = require('../../models/Product');

//@routes POST api/add_product/
//@desc create a product
//@response - status: true or false
// {
//     "product_name":"Tecno Camon CX",
//     "product_desc":"This product is a product",
//     "status":"true",
//     "brand":"Tecno",
//     "variations":[{"variation":"Black-64GB","buying_price":10000,"selling_price":20000}],
//     "store":"Hanis Store"
// }

router.post('/add_product', auth, async(req,res)=>{
	const store = req.user.id;
    const newProduct = new Products(req.body);
	newProduct.store = store; 
    try{
        const product = await newProduct.save();
        if(product){
			const change = addProduct(newProduct);
            res.status(200).send({'status':true, message:change.message});
        }else{
            res.json({'status':false,'reason':"Error Creating Product"});
        }
    }catch(err){
        res.json({'status':false, 'reason':"Server Error"});;
    }

});


//@routes GET api/show_store_products/
//@desc Get all 
//@response - status: true or false | data | error
router.get('/show_store_products/:id', auth, async (req, res) => {
	const store = req.params.id;
	const products = await Products.find({store});
	try {
		if (!products){return res.status(400).send({status:false, error:'Problem with the query'})};
		res.status(200).send({status:true,data:products});
        
	} catch (err) {
		res.status(400).json({ msg: err });
	}
});


//@routes GET api/show_store_products/
//@desc Get all 
//@response - status: true or false | data | error
router.get('/scan_barcode/:store/:id', auth, async (req, res) => {
	const barcode = req.params.id;
	const store = req.params.store;
	let products = await Products.findOne({"variations.barcode":barcode,store});
	try {
		if (!products){return res.status(400).send({status:false, msg:'Product not found, please scan again!'})};

		let key = products.variations.findIndex(item => item.barcode === barcode);

		res.status(200).send({status:true,data:products,key});
        
	} catch (err) {
		res.status(400).json({ msg: err });
	}
});


//@routes PUT api/update_product/
//@desc update product 
//@response - status: true or false | error
router.patch('/update_product', auth, async (req, res) => {
	try {
        const products = await Products.findByIdAndUpdate(req.body._id,req.body);
		if (!products){res.status(400).send({status:false, error:'Problem with the update query'})};
		
		//add change to system
		const cresult = await updateProductChange(products,req.body);
		res.status(200).send({status:true, change: cresult});
        
	} catch (err) {
		console.log(err);
		res.status(400).json({ msg: err });
	}
});

//@routes PUT api/update_inventory/
//@desc update inventory
//@response - status: true or false | error
router.patch('/update_inventory', auth, async (req, res) => {
	try {
        const products = await Products.findByIdAndUpdate(req.body._id,req.body);
		if (!products){res.status(400).send({status:false, error:'Problem with the update query'})};
		
		//add change to system
		const cresult = await updateProductChange(products,req.body);
		res.status(200).send({status:true, change:cresult});
        
	} catch (err) {
		res.status(400).json({ msg: err });
	}
});



module.exports = router;
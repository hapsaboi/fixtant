const express = require('express');
const router = express.Router();

const {auth} = require('../../middleware/auth');
// Sale Model
const Sales = require('../../models/Sale');
const Products = require('../../models/Product');

//@routes POST api/add_sale/
//@desc create a sale 
//@response - status: true or false
// {
//     "buyer_name":"Hanis Hapsa",
//     "phone":"09094******",
//     "address":"Karewa Masakare",
//     "payment_method":"Cash",
//     "items":[
//          {"product_id":"60f71403c5b8cf2294520538","product_name":"Tecno Camon","quantity":10,"variation":"Medium","store":"Hive Store",price":20000}
//      ]
// }

router.post('/add_sale', auth, async(req,res)=>{
    const newSale = new Sales(req.body);
    newSale.store = req.user.id;
    const items = req.body.items;
    const ids = items.map(s=>s.product_id);
    const products = await Products.find( { _id : { $in : ids } } );

    try{
        const sale = await newSale.save();
        for (var item of items) {
            let temp = (products.filter(product => product._id == item.product_id))[0];
            let tempItem = temp.variations.filter(x => x.variation == item.variation)[0];
            tempItem.quantity = tempItem.quantity - item.quantity;
            await Products.findByIdAndUpdate(temp._id,temp);
        };
        if(sale){
            res.status(200).send({'status':true});
        }else{
            res.status(400).send({'status':false});
        }
    }catch(err){
        res.status(400).json({ msg: err });
    }

});

//@routes GET api/sale/
//@desc Get all 
//@response - status: true or false | data | error
router.get('/show_sales', auth, async (req, res) => {
	const store = req.user.id;
    let sale;
   
    let duration = req.query.duration;
    if(duration){ 
        var d = new Date();
        if(duration==='daily'){
            sale = await Sales.find({store,
                date: {
                    "$gte":d.setDate(d.getDate()-7), 
                    "$lt": new Date()
                }
            }).sort('date');
        }else if(duration ==='weekly'){
            var firstDay = new Date(d.getFullYear(), d.getMonth(), 2);
            sale = await Sales.find({store,
                date: {
                    "$gte":firstDay, 
                    "$lt": new Date()
                }
            }).sort('date');
        }else if(duration==='monthly'){
            var firstDayofYear = new Date(d.getFullYear(), 0, 2);
            sale = await Sales.find({store,
                date: {
                    "$gte":firstDayofYear, 
                    "$lt": new Date()
                }
            }).sort('date');
        }
    }else{
        sale = await Sales.find({store}).sort({date:-1});
    };
	try {
		if (!sale){res.status(400).send({status:false, error:'Problem with the query'})};
		res.status(200).send({status:true,data:sale});
        
	} catch (err) {
		res.status(400).json({ msg: err });
	}
});

// async function verifyQuantity(saleData){
//     let items = saleData.items;
//     for(var item in items){

//     }
// }
module.exports = router;
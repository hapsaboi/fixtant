const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    product_id:{
        type: String, 
        required: true
    },
	product_name:{
        type: String, 
        required: true
    },
    quantity:{
        type: Number, 
        required: true
    },
	variation:{
        type: String, 
    },
    price:{
        type: Number, 
        required: true
    }
    

});

const SaleSchema = new Schema(
	{
		buyer_name: {
			type: String
		},
		phone: {
			type: String
		},
		address: {
			type: String,
		},
        payment_method: {
			type: String,
			required: true
		},
        items:[itemSchema],
		store:{
			type: String, 
			required: true
		},
		date:{
			type: Date, 
			default: Date.now
		},
		type: {
			type: String, 
			required:true
		},
		sold_by:{}
	}
);


module.exports = mongoose.model('Sales', SaleSchema);

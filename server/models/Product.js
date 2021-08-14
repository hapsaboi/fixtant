const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VariationSchema = new Schema(
	{
		variation: String,
		model:String,
		buying_price: Number,
		selling_price: Number,
		quantity:{
			type:Number,
			default:0
		}
	}
);

const ProductSchema = new Schema({
	product_name: {
		type: String,
		required: true
	},
	product_desc: {
		type: String,
		required: true
	},
	status: {
		type: Boolean,
		default: true
	},
	brand: {
		type: String,
		required: true
	},
	store:{
		type:String,
		required: true
	},
	variations:[ VariationSchema ]

});

module.exports = mongoose.model('Product', ProductSchema);

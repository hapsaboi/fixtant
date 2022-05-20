const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServiceSchema = new Schema({
	service_name: {
		type: String,
		required: true
	},
	service_desc: {
		type: String,
		required: true
	},
	store:{
		type:String,
		required: true
	},
	price:{
		type:Number,
		required: true
	},
	sold_by:{}
});

module.exports = mongoose.model('Service', ServiceSchema);

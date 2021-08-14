const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DataSchema = new Schema(
	{
		message: {
			type: String,
			required: true
		},
		item_id: {
			type: String,
			required: true
		},
		type: {
			type: String,
			required: true
		},
		date:{
			type: Date, 
			default: Date.now
		}
	}
);

const ChangeSchema = new Schema({
	store: {
		type: String,
		required: true
	},
	
	data:[ DataSchema ]


});

module.exports = mongoose.model('Changes', ChangeSchema);

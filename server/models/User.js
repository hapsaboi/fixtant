const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    store: {
        type: String,
        required: true,
    },
    address: {type: String},
    city: {type: String},
    state: {type: String},
    about: {type: String},
    register_date: {
        type: Date,
        default: Date.now,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'not verified',
    },
    tempToken: String,
    tempTokenExpire: Date,
});


module.exports = mongoose.model('Users', UserSchema);
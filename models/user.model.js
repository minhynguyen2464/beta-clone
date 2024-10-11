// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: String,
	email: String,
	password: String,
	dob: Date,
	gender: String,
	phoneNumber: String,
	city: String,
	address: String,
	role: { type: String, default: 'user' },
});

const User = mongoose.model('User', userSchema);

module.exports = User;

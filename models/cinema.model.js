const mongoose = require('mongoose');

const cinemaSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	structure: {
		type: [String],
		required: true,
	},
	seatsAvailable: {
		type: Number,
		required: true,
	},
	endTime: {
		type: [Date],
	},
});

const Cinema = new mongoose.model('Cinema', cinemaSchema);

module.exports = Cinema;

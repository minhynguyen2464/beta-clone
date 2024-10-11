const mongoose = require('mongoose');
const User = require('./user.model');
const Movie = require('./movie.model');
const Showtime = require('./movie.model');

const bookingSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	movie: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Movie',
		required: true,
	},
	bookedAt: {
		type: Date,
		required: true,
	},
	showtimes: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Showtime',
	},
	seats: {
		type: [String],
		required: true,
	},
	seatsType: {
		type: String,
		required: true,
	},
	cinema: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
	},
	transactionDate: {
		type: Date,
	},
	status: {
		type: Number,
	},
});

const Booking = new mongoose.model('Booking', bookingSchema);

module.exports = Booking;

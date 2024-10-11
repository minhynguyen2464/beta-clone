const mongoose = require('mongoose');

const showtimeSchema = mongoose.Schema({
	time: {
		type: Date,
	},
	seatsAvailable: {
		type: Number,
	},
	cinemaRoom: {
		type: String,
	},
	seatsBooked: [
		{
			type: [String],
		},
	],
});

const movieSchema = mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	director: {
		type: String,
		required: true,
	},
	cast: {
		type: [String],
		required: true,
	},
	genre: {
		type: [String],
		required: true,
	},
	duration: {
		type: Number,
		required: true,
	},
	language: {
		type: String,
		required: true,
	},
	releaseYear: {
		type: Date,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	poster: {
		type: String,
		required: true,
	},
	status: {
		type: Number,
		required: true,
	},
	trailer: {
		type: String,
	},
	showtimes: [showtimeSchema],
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;

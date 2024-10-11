// Importing necessary modules
const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');

router
	.route('/login')
	.get(userController.getLogin)
	.post(userController.postLogin);

router
	.route('/register')
	.get(userController.getRegister)
	.post(userController.postRegister);

router
	.route('/account/edit')
	.get(userController.getAccountEdit)
	.put(userController.putAccountEdit);

router
	.route('/movie/seat')
	.get(userController.getSeatSelect)
	.post(userController.postSeatSelect);

// Route to handle user logout
router.get('/logout', userController.logout);

// Route to handle fetching and rendering movie details
router.get('/detail', userController.getMovieDetail);

// Route to handle fetching and rendering the movie page
router.get('/movie', userController.getMovie);

router.get('/account/history', userController.getAccountHistory);

router.get('/api/upcommingMovie', userController.getUpcommingMovie);

// Default route to render the index page
router.get('/', userController.getIndex);

// Exporting the router
module.exports = router;

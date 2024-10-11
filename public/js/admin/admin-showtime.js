/* This JavaScript code snippet is adding an event listener to a button with the id 'buttonClick'. When
the button is clicked, it performs the following actions: */
const button = document.getElementById('buttonClick');
button.addEventListener('click', async (e) => {
	e.preventDefault;

	// Retrieve other form values
	const movieTitle = document.getElementById('movieTitle').value;
	const duration = document.getElementById('duration').value;
	const director = document.getElementById('director').value;
	// Retrieve showtimes from the table
	const showtimesTableBody = document.getElementById('showtimesTableBody');
	const showtimeRows = showtimesTableBody.getElementsByTagName('tr');
	const showtimes = [];

	// Loop through each row and retrieve showtime values
	for (let i = 0; i < showtimeRows.length; i++) {
		const cells = showtimeRows[i].getElementsByTagName('td');
		const showtimeValue = cells[0].innerHTML;
		const cinemaRoomValue = cells[1].innerHTML;

		const showtimeObject = {
			movieTitle: movieTitle,
			showtime: showtimeValue,
			cinemaRoom: cinemaRoomValue,
		};

		showtimes.push(showtimeObject);
	}

	// Make a POST request to the '/login' endpoint using Axios
	axios
		.post('/admin/addShowtimes', showtimes)
		.then((res) => {
			// Log response data to the console and display a success message
			console.log('Movie ID:', movieTitle);
			console.log('Duration:', duration);
			console.log('Director:', director);
			console.log('Showtimes:', showtimes);
			alert('Thêm suất chiếu thành công');
			location.reload();
			// Reload the page after successful registration
			//window.location.reload(true);
		})
		.catch((err) => {
			// Log any errors to the console
			console.error('Error:', err);
		});
});

/**
 * The function `addShowtimeRow` dynamically adds a new row to a table with showtime and cinema room
 * information, along with a delete button for each row.
 */
function addShowtimeRow() {
	const showtimesTableBody = document.getElementById('showtimesTableBody');

	// Create a new row
	const newRow = showtimesTableBody.insertRow();

	// Create cells for showtime, seats available, cinema room, and action
	const showtimeCell = newRow.insertCell(0);
	const cinemaRoomCell = newRow.insertCell(1);
	const actionCell = newRow.insertCell(2);

	// Get the values from the inputs
	const showtimeInput = document.getElementById('showtimeInput');
	const cinemaRoomInput = document.getElementById('cinemaRoom');

	const showtimeValue = showtimeInput.value;
	const cinemaRoomValue = cinemaRoomInput.value;

	// Set the values to the cells
	showtimeCell.innerHTML = showtimeValue;
	cinemaRoomCell.innerHTML = cinemaRoomValue;

	// Add a delete button to the action cell
	const deleteButton = document.createElement('button');
	deleteButton.innerHTML = 'Delete';
	deleteButton.className = 'btn btn-danger';
	deleteButton.onclick = function () {
		showtimesTableBody.deleteRow(newRow.rowIndex);
	};

	// Append the delete button to the action cell
	actionCell.appendChild(deleteButton);
}

function deleteShowTime(showtimeID) {
	const movieID = '<%= movie._id %>';
	axios
		.delete(
			'/admin/deleteShowtimes?showtimeID=' + showtimeID + '&movieID=' + movieID
		)
		.then((res) => {
			alert('Xóa xuất chiếu thành công');
			window.location.reload();
		})
		.catch((err) => {
			console.log(err);
		});
}

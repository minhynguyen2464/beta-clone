//Client handler for admin/movie.ejs
const form = document.getElementById('movieForm');
form.addEventListener('submit', function (e) {
	e.preventDefault();
	const formData = {
		title: document.getElementById('title').value,
		director: document.getElementById('director').value,
		cast: document.getElementById('cast').value,
		genre: document.getElementById('genre').value,
		duration: document.getElementById('duration').value,
		language: document.getElementById('language').value,
		releaseYear: document.getElementById('releaseYear').value,
		description: document.getElementById('description').value,
		status: document.getElementById('status').value,
		trailer: document.getElementById('trailer').value,
		poster: document.getElementById('poster').files[0], // Assuming file input for poster
	};
	axios
		.post('/admin/api/movie', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		.then((res) => {
			console.log('Response data:', res.data);
			alert('Thêm phim thành công');
			window.location.reload(true);
		})
		.catch((err) => {
			console.log('Error:', err);
		});
});
axios
	.get('/admin/api/movie')
	.then((res) => {
		const movies = res.data;
		renderMoviesTable(movies);
	})
	.catch((err) => {
		console.error('Error fetching movies:', error);
	});

function renderMoviesTable(movies) {
	const tableBody = document.querySelector('#moviesTable tbody');
	// Clear existing rows
	tableBody.innerHTML = '';

	// Loop through movies and add rows to the table
	movies.forEach((movie) => {
		let movieID = '';
		const row = tableBody.insertRow();
		// Add cells with movie data
		const path = '../images/' + movie.poster;
		// Create an <a> tag
		const link = document.createElement('a');
		link.href = './addShowtimes?movie=' + movie._id; // Set the href attribute to your desired URL
		link.innerHTML = '<i class="fa-solid fa-plus"></i>'; // Set the text content of the <a> tag
		link.className = 'btn btn-success edit-button';

		const deleteButton = document.createElement('p');
		//deleteButton.href = '';  // Set the href attribute to your desired URL
		deleteButton.innerHTML = '<i class="fa-solid fa-x"></i>'; // Set the text content of the <a> tag
		deleteButton.className = 'btn btn-danger edit-button';
		deleteButton.addEventListener('click', (e) => {
			if (confirm('Bạn có muốn xóa phim này không')) {
				axios
					.delete('./deleteMovie?movie=' + movie._id)
					.then((res) => {
						console.log(`Deleted post success`);
						window.location.reload();
					})
					.catch((err) => {
						console.log(err);
					});
			}
		});

		const updateButton = document.createElement('p');
		updateButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>'; // Set the text content of the <a> tag
		updateButton.className = 'btn btn-warning edit-button';
		//Logic xử lý nếu user nhấn update button
		updateButton.addEventListener('click', (e) => {
			axios
				.get('./getUpdateInfo?movie=' + movie._id)
				.then((res) => {
					const movie = res.data;
					movieID = movie._id;
					document.getElementById('title').value = movie.title;
					document.getElementById('director').value = movie.director;
					document.getElementById('cast').value = movie.cast.join(', ');
					document.getElementById('genre').value = movie.genre.join(', ');
					document.getElementById('duration').value = movie.duration;
					document.getElementById('language').value = movie.language;
					document.getElementById('trailer').value = movie.trailer;
					//Format ngày để đem  vào input field
					const releaseYearDate = new Date(movie.releaseYear);
					const formattedReleaseYear = releaseYearDate
						.toISOString()
						.split('T')[0];
					document.getElementById('releaseYear').value = formattedReleaseYear;
					//document.getElementById('releaseYear').value = movie.releaseYear;
					document.getElementById('description').textContent =
						movie.description;
				})
				.catch((err) => {
					console.log(err);
				});
		});

		//Logic xử lý nếu user nhấn update button
		updateSubmit = document.getElementById('update');
		updateSubmit.addEventListener('click', (e) => {
			if (movieID) {
				const formData = {
					title: document.getElementById('title').value,
					director: document.getElementById('director').value,
					cast: document.getElementById('cast').value,
					genre: document.getElementById('genre').value,
					duration: document.getElementById('duration').value,
					language: document.getElementById('language').value,
					releaseYear: document.getElementById('releaseYear').value,
					description: document.getElementById('description').value,
					status: document.getElementById('status').value,
					trailer: document.getElementById('trailer').value,
				};
				//Gửi put request bằng axios
				axios
					.put('./updateMovie?movie=' + movieID, formData)
					.then((res) => {
						alert('Cập nhật thành công');
						window.location.reload();
					})
					.catch((err) => {
						console.log(err);
					});
			}
		});

		// Insert the <a> tag into the first cell of the row
		row.insertCell().appendChild(link);
		row.insertCell().appendChild(deleteButton);
		row.insertCell().appendChild(updateButton);
		row.insertCell().textContent = movie.title;
		row.insertCell().textContent = movie.director;
		row.insertCell().textContent = movie.cast.join(', ');
		row.insertCell().textContent = movie.genre.join(', ');
		row.insertCell().textContent = movie.duration;
		row.insertCell().textContent = movie.language;
		row.insertCell().textContent = new Date(
			movie.releaseYear
		).toLocaleDateString();
		row.insertCell().textContent = movie.description;
		row.insertCell().innerHTML = `<img src="${path}" alt="Movie Poster" style="max-width: 100px;">`;
	});

	function searchBox() {
		let timeout = null; // Declare a variable to hold the timeout, making it accessible to clear if needed

		document.getElementById('searchBox').addEventListener('keyup', function () {
			// Clear the previous timeout on every keyup to reset the delay
			clearTimeout(timeout);

			// Set a new timeout
			timeout = setTimeout(() => {
				let searchQuery = this.value.toLowerCase();
				let table = document.getElementById('moviesTable');
				let tr = table.getElementsByTagName('tr');

				// Loop through all table rows, and hide those who don't match the search query
				for (let i = 0; i < tr.length; i++) {
					let td = tr[i].getElementsByTagName('td');
					let rowContainsQuery = false;

					for (let j = 0; j < td.length; j++) {
						if (td[j]) {
							if (td[j].textContent.toLowerCase().indexOf(searchQuery) > -1) {
								rowContainsQuery = true;
								break; // Found a match, no need to continue checking this row
							}
						}
					}

					if (rowContainsQuery) {
						tr[i].style.display = '';
					} else {
						tr[i].style.display = 'none'; // Hide the row if not match
					}
				}
			}, 500); // Set the delay here (2000 milliseconds equals 2 seconds)
		});
	}
	searchBox();
}

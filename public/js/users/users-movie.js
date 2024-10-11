const upcommingTrigger = document.getElementById('upcomming');
const nowShowingTrigger = document.getElementById('nowShowing');
upcommingTrigger.addEventListener('click', (e) => {
	nowShowingTrigger.classList.remove('active');
	upcommingTrigger.classList.add('active');
	const status = 2;
	axios
		.get('/api/upcommingMovie?status=' + status)
		.then((res) => {
			const movies = res.data;
			console.log(movies);
			renderMovies(movies);
		})
		.catch((err) => {
			console.log(err);
		});
});
nowShowingTrigger.addEventListener('click', (e) => {
	upcommingTrigger.classList.remove('active');
	nowShowingTrigger.classList.add('active');
	const status = 1;
	axios
		.get('/api/upcommingMovie?status=' + status)
		.then((res) => {
			const movies = res.data;
			console.log(movies);
			renderMovies(movies);
		})
		.catch((err) => {
			console.log(err);
		});
});

function renderMovies(movies) {
	const movieContainer = document.getElementById('movieContainer');
	movieContainer.innerHTML = '';

	movies.forEach((movie) => {
		const movieDiv = document.createElement('div');
		movieDiv.classList.add('col-md-3', 'film-item');
		const buttonText = movie.status === 2 ? 'Sắp chiếu' : 'Mua vé';

		movieDiv.innerHTML = `
                    <img src="./images/${
											movie.poster
										}" alt="Film 1 Poster" class="film-poster">
                    <h5 class="mt-2 movie-title">${movie.title}</h5>
                    <p><strong>Thể loại:</strong> ${movie.genre.join(', ')}</p>
                    <p><strong>Thời lượng:</strong> ${movie.duration} phút</p>
                    <a href="/detail?movie=${
											movie._id
										}" class="btn btn-primary btn-block buy-ticket-btn" style="text-decoration:none;color:white;">
                        <i class="fa-solid fa-cart-shopping"></i> ${buttonText}
                    </a>
                `;

		movieContainer.appendChild(movieDiv);
	});
}

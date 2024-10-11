// Get the form element by its ID
const form = document.getElementById('userForm');

// Add an event listener to the form for the 'submit' event
form.addEventListener('submit', async function (e) {
	// Prevent the default form submission behavior
	e.preventDefault();

	// Extract form data from input fields
	const formData = {
		email: document.getElementById('email').value,
		password: document.getElementById('password').value,
	};

	// Make a POST request to the '/login' endpoint using Axios
	axios
		.post('/login', formData)
		.then((res) => {
			const user = res.data;
			if (user.role === 'admin') {
				window.location.href = '../admin/';
			} else {
				// Log response data to the console and display a success message
				window.location.href = '../movie';
			}
		})
		.catch((err) => {
			// Log any errors to the console'
			alert(err.response.data.error);
			//console.error('Error:', err);
		});
});

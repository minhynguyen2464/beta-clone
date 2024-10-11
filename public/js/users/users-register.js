// Get the form element by its ID
const form = document.getElementById('userForm');

// Add an event listener to the form for the 'submit' event
form.addEventListener('submit', function (e) {
	// Prevent the default form submission behavior
	e.preventDefault();

	// Extract form data from input fields
	const formData = {
		name: document.getElementById('name').value,
		password: document.getElementById('password').value,
		confirmPassword: document.getElementById('confirmPassword').value,
		email: document.getElementById('email').value,
		dob: document.getElementById('dob').value,
		phoneNumber: document.getElementById('phonenumber').value,
		gender: document.getElementById('gender').value,
	};

	// Log form data to the console for debugging purposes
	console.log(formData);

	// Make a POST request to the '/register' endpoint using Axios
	axios
		.post('/register', formData)
		.then((res) => {
			// Log response data to the console and display a success message
			alert('Đăng ký thành công');
			// Reload the page after successful registration
			window.location.reload(true);
		})
		.catch((err) => {
			// Log any errors to the console'
			alert(err.response.data.error);
			//console.error('Error:', err);
		});
});

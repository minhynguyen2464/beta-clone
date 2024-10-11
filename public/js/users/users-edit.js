// Get the form element by its ID
const form = document.getElementById('form-account');

// Add an event listener to the form for the 'submit' event
form.addEventListener('submit', (e) => {
	// Prevent the default form submission behavior
	e.preventDefault();

	// Extract form data from input fields
	const formData = {
		name: document.getElementById('name').value,
		phoneNumber: document.getElementById('phone').value,
		city: document.getElementById('city').value,
		address: document.getElementById('address').value,
	};

	// Make a PUT request to the '/account/edit' endpoint using Axios
	axios
		.put('/account/edit', formData)
		.then((res) => {
			// Display a success message and reload the page upon successful update
			alert('Cập nhật thông tin thành công');
			window.location.reload(true);
		})
		.catch((err) => {
			// Log any errors to the console
			console.log(err);
		});
});

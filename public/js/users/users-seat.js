let choosenSeat = '<%= movieShowtime.showtimes[0].seatsBooked %>';
const cinemaString = `<%= cinema %>`;
const seats = cinemaString.split(',');
/*const seats = [
            "Q88", "Q88", "Q88", "A7", "A6", "A5", "A4", "A3", "A2", "A1", "Q88", 'br',
            "Q88", "Q88", "Q88", "B8", "B7", "B6", "B5", "B4", "B3", "B2", "Q88", 'br',
            "C10", "C9", "Q88", "C8", "C7", "C6", "C5", "C4", "C3", "C2", "Q88", 'br',
            "D10", "D9", "Q88", "D8", "D7", "D6", "D5", "D4", "D3", "D2", "Q88", 'br',
            "E10", "E9", "Q88", "E8", "E7", "E6", "E5", "E4", "E3", "E2", "Q88", 'br',
            "F10", "F9", "Q88", "F8", "F7", "F6", "F5", "F4", "F3", "F2", "Q88", 'br',
            "G10", "G9", "Q88", "G8", "G7", "G6", "G5", "G4", "G3", "G2", "Q88", 'br',
            "H10", "H9", "Q88", "H8", "H7", "H6", "H5", "H4", "H3", "H2", "Q88", 'br',
            "J10", "J9", "Q88", "J8", "J7", "J6", "J5", "J4", "J3", "J2", "Q88", 'br',
            "K10", "K9", "Q88", "K8", "K7", "K6", "K5", "K4", "K3", "K2", "Q88", 'br',
            // Add more seats as needed
        ];*/
//Count seatnumber
const seatMap = document.getElementById('seat-map');
const checkoutBtn = document.getElementById('checkoutBtn');
const vipSeat = ['E', 'F', 'G', 'H', 'I', 'J', 'K'];
const disableSeat = ['A1', 'A2', 'J5', 'J6'];
seats.forEach((seat) => {
	const seatElement = document.createElement('div');
	seatElement.classList.add('seat');

	if (choosenSeat.includes(seat)) {
		seatElement.classList.add('unavailable');
		seatElement.textContent = seat;
	} else if (seat === 'br') {
		seatElement.classList.add('break');
	} else if (seat === 'Q88') {
		seatElement.classList.add('none');
	} else {
		seatElement.textContent = seat;
		// Set additional styles for VIP seats
		if (vipSeat.some((prefix) => seat.startsWith(prefix))) {
			seatElement.classList.add('vip');
		}
	}

	seatMap.appendChild(seatElement);

	if (seat !== 'Q88' && seat !== 'br') {
		if (seatElement.classList.contains('unavailable')) {
			return;
		}
		seatElement.addEventListener('click', () => toggleSeat(seatElement));
	}
});
let totalPrice = 0;
let vipSeatCount = 0;
let standardSeatCount = 0;
const seatType = [];

function toggleSeat(seatElement) {
	//Check seat
	seatType.push(seatElement.classList.contains('vip'));
	//If the first choose seat is VIP
	if (seatType[0] === true) {
		if (seatType.includes(false)) {
			alert('Vui lòng chọn ghế cùng loại');
			window.location.reload();
			return;
		}
	}
	//If the first choose seat is normal
	else {
		if (seatType.includes(true)) {
			alert('Vui lòng chọn ghế cùng loại');
			window.location.reload();
			return;
		}
	}

	seatElement.classList.toggle('selected');
	showSeat(seatElement);
	// Check if the seat is selected
	const isSelected = seatElement.classList.contains('selected');
	// Check if the classList contains the words 'vip' or 'seat'

	if (seatElement.classList.contains('vip')) {
		const isVip = seatElement.classList.contains('vip');
		vipSeatCount += isVip && isSelected ? 1 : isVip && !isSelected ? -1 : 0;
	} else {
		const isStandard = seatElement.classList.contains('seat');
		standardSeatCount +=
			isStandard && isSelected ? 1 : isStandard && !isSelected ? -1 : 0;
	}

	// Get the price element by ID
	const priceElement = document.getElementById('price');
	const totalPriceElement = document.getElementById('total-price');
	// Set the price based on the total counts
	const vipPrice = vipSeatCount * 129000;
	const standardPrice = standardSeatCount * 99000;
	totalPrice = vipPrice + standardPrice;

	priceElement.innerText =
		totalPrice > 0 ? ` ${totalPrice.toLocaleString('vi-VN')} ₫` : ' 0 ₫';
	totalPriceElement.innerText =
		totalPrice > 0 ? ` ${totalPrice.toLocaleString('vi-VN')} ₫` : ' 0 ₫';
}

/**
 * The function `showSeat` updates the selected seats and their types based on user interactions with
 * seat elements on a webpage.
 * @param seatElement - The `seatElement` parameter in the `showSeat` function represents the HTML
 * element that corresponds to a seat in a seating arrangement. This function is designed to toggle the
 * selection of a seat and update the list of selected seats displayed on the page.
 */
function showSeat(seatElement) {
	//Check if choose different seat type

	const isSelected = seatElement.classList.contains('selected');

	// If seatElement is an input element, get its value
	const seatValue = seatElement.innerText;

	// Update the content of the element with id "seat-choose"
	const seatChooseElement = document.getElementById('seat-choose');

	// Parse the current seats from the innerText into an array
	const selectedSeats = seatChooseElement.innerText
		.split(',')
		.map((seat) => seat.trim());

	if (isSelected) {
		// Append the selected seat to the array
		selectedSeats.push(seatValue.trim());
	} else {
		// Remove the deselected seat from the array
		const indexToRemove = selectedSeats.indexOf(seatValue.trim());
		if (indexToRemove !== -1) {
			selectedSeats.splice(indexToRemove, 1);
		}
	}

	// Update the content of "seat-choose" with the array
	seatChooseElement.innerText = selectedSeats.join(', ');

	if (
		seatElement.classList.contains('vip') &&
		seatChooseElement.innerText != ''
	) {
		document.getElementById('seat-type').innerText = 'VIP';
	} else if (
		seatElement.classList.contains('seat') &&
		seatChooseElement.innerText != ''
	) {
		document.getElementById('seat-type').innerText = 'Thường';
	} else {
		document.getElementById('seat-type').innerText = '';
	}
}

checkoutBtn.addEventListener('click', () => {
	const searchParams = new URLSearchParams(window.location.search); //Get param
	//Get seat value
	const selectedSeats = document.querySelectorAll('.seat.selected');
	const selectedSeatNumbers = Array.from(selectedSeats).map(
		(seat) => seat.textContent
	);
	const selectedSeatType = document.getElementById('seat-type').innerHTML;
	if (selectedSeatNumbers.length > 0) {
		const formData = {
			user: searchParams.get('user'),
			movie: searchParams.get('movie'),
			showtimes: searchParams.get('showtime'),
			seats: selectedSeatNumbers,
			seatsType: selectedSeatType,
			bookedAt: new Date(),
		};
		const user = searchParams.get('user');
		if (user === '') {
			window.location.href = '../login';
		} else {
			axios
				.post('/movie/seat', formData)
				.then((res) => {
					window.location.href = `/order/create_payment_url?bookingID=${res.data._id}&price=${totalPrice}`;
				})
				.catch((err) => {
					console.error('Error:', err);
				});
		}
	} else {
		alert('Vui lòng chọn ghế');
	}
});

document.addEventListener('DOMContentLoaded', function () {
	var dateInfo = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
	var ul = document.getElementById('dateInfo');
	var noShowtimeParagraph;
	var defaultDayIndex = 0; // Set the index of the default day

	for (var i = 0; i < 7; i++) {
		var currentDate = new Date();
		currentDate.setDate(currentDate.getDate() + i);
		var currentDay = currentDate.getDay();
		var currentMonth = currentDate.getMonth() + 1;
		var dateString = `${currentDate.getDate()}/${currentMonth} - ${
			dateInfo[currentDay]
		}`;
		var li = document.createElement('li');
		let a = document.createElement('a');
		a.id = `movieDate${i}`;
		a.name = `${currentDate.getDate()}/${currentMonth}`;
		a.href = `#${currentDate.getDate()}`;
		a.textContent = dateString;
		li.appendChild(a);
		ul.appendChild(li);

		a.addEventListener('click', function (event) {
			event.preventDefault(); // prevent the default behavior of the anchor tag
			var clickedDate = event.currentTarget.name.toString();

			// Select all div elements with id attribute
			var allDivs = document.querySelectorAll(`div[id]`);

			// Check if there are div elements with the specified ID
			var divExists = false;
			allDivs.forEach(function (div) {
				if (div.id === clickedDate) {
					div.style.display = 'block';
					divExists = true;
					const textInfo = document.getElementById('info'); // Assuming 'info' is the parent node
					textInfo.innerText = '';
				} else {
					div.style.display = 'none';
				}
			});

			// If no div element exists and no paragraph has been created, create and append a paragraph element
			if (!divExists && !noShowtimeParagraph) {
				const textInfo = document.getElementById('info'); // Assuming 'info' is the parent node
				textInfo.innerText = 'Không có suất chiếu.';
			} else if (divExists && noShowtimeParagraph) {
				// If div exists, remove the previously created paragraph
				noShowtimeParagraph.parentNode.removeChild(noShowtimeParagraph);
				noShowtimeParagraph = null;
			}
		});

		// Set the default day
		if (i === defaultDayIndex) {
			var defaultDayDiv = document.getElementById(`movieDate${i}`);
			if (defaultDayDiv) {
				defaultDayDiv.click();
			}
		}
	}
});

var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: -34.397, lng: 150.644},
		zoom: 12
	});
	var input = document.getElementById('txtSearchLocation');
	var searchBox = new google.maps.places.SearchBox(input);
}


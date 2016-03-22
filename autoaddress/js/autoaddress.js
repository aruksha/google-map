// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

// Global variables across functions
var map;
var autocomplete;
var infowindow;
var marker;

// Function to create map in HTML placeholder viz 'map'
function createmap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 37.702, lng: -121.935},
		zoom: 12
	});
}

// Function to create and enable autocomplete. Takes HTML input element with ID 'autoaddress'
function enableautocomplete() {
	var input = document.getElementById('autoaddress');
	var options = {};
	autocomplete = new google.maps.places.Autocomplete(input, options);
}

// Function to create a simple marker in the map, no location is set yet.
function createmarker() {
	marker = new google.maps.Marker({
		map: map,
		anchorPoint: new google.maps.Point(0, 0)
	});
}

// Function which listens for placechange in the autocomplete input.
function listenautocomplete() {
	autocomplete.addListener('place_changed', function() {
		// remove visibility of marker
		marker.setVisible(false);
		// gets the place after autocomplete
		var place = autocomplete.getPlace();
		if(!place.geometry) {
			window.alert("Autocomplete's returned place contains no geometry");
			return;
		}

		// Displays in the map.
		if(place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		} else {
			map.setCenter(place.geometry.location);
			map.setZoom(17);
		}
		// set location of the  marker
		marker.setPosition(place.geometry.location);
		// set visibility of marker
		marker.setVisible(true);
	});
}

function initialize() {
	createmap();
	enableautocomplete();
	createmarker();
  listenautocomplete();
}

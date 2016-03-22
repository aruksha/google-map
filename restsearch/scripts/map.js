var map;
var infowindow;

function initMap() {

/* initialize google map */
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14
  });

  infowindow = new google.maps.InfoWindow();
  
  /* w3c standard: this is browser specific, check the compatibility issues*/
  /* navigator.geolocation is true only if supported by browser */
  /* browser compatibility: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition */
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      map.setCenter(initialLocation);
      createMarkerFromLocation(initialLocation);
      /* mark the restaurants near to your current location and which are open */ 
      searchNearby(initialLocation);
    });
  }
  
  /* user submits address using search box, submit event is triggred */
  var geocoder = new google.maps.Geocoder();
  document.getElementById('submit').addEventListener('click', function() {
    geocodeAddress(geocoder, map);
  });
 }

function geocodeAddress(geocoder, resultsMap) {
  var address = document.getElementById('address').value;

  geocoder.geocode({'address': address}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      resultsMap.setCenter(results[0].geometry.location);
      searchNearby(results[0].geometry.location);
      createMarkerFromLocation(results[0].geometry.location);
    } 
    else {
      alert('Enter a valid address.');
    }
  });
}

function searchNearby(location) {
      var service = new google.maps.places.PlacesService(map);
      /* search for nearby restaurants */  
      service.nearbySearch({
        location: {lat: location.lat(), lng: location.lng()},
        radius: 1000,
        types: ['restaurant'],
        opennow:true
        }, createMarkers);
}

/* if nearby restaus found, create markers for them */
function createMarkers(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) { /* this status and results are returned by PlacesService call */
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

/* this function creates markers */
function createMarker(place) {

  var marker = new google.maps.Marker({
    map: map,
      animation: google.maps.Animation.DROP,
    position: place.geometry.location,
    icon: {url:"images/discover.png",
    scaledSize: new google.maps.Size(20, 20)}
  });

  /* when user clicks on marker, display info window */
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}

function createMarkerFromLocation(location) {
  var marker = new google.maps.Marker({
    map: map,
    animation: google.maps.Animation.BOUNCE,
    position: location
  });
  
  /* when user clicks on marker, display info window */
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent("my location");
    infowindow.open(map, this);
  });
}
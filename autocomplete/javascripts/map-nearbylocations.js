var map;
var infowindow;
var placeId;
var geocoder;
var mapfilter_typ;
var mapfilter_typ_check;

function initMap() 
{
   //alert("going");//new
   //mapfilter_typ = document.getElementById("hdfMapsearchtyp").value;
    map = new google.maps.Map(document.getElementById('showMap'), {
        zoom: 12
    });
    infowindow = new google.maps.InfoWindow();
    geocoder = new google.maps.Geocoder();
    geocodeAddress(geocoder, map);
    /* user submits address using search box, submit event is triggred *///for any button click
    //var geocoder = new google.maps.Geocoder();
    //document.getElementById('submit').addEventListener('click', function () {
    //    geocodeAddress(geocoder, map);
    //});
    //for search autocomplete places
    var input = document.getElementById('txtSearchLocation');
    var searchBox = new google.maps.places.SearchBox(input);
}

function geocodeAddress(geocoder, resultsMap) 
{
    var address = document.getElementById('hdfloc').value; //"Shri Kunj, Jayadev Vihar, Bhubaneshwar, Odisha";
    geocoder.geocode({ 'address': address }, function (results, status) {
        //if (mapfilter_typ == '')
        //{
        //    resultsMap.setCenter(results[0].geometry.location);
        //    createMarkerFromLocation(results[0].geometry.location);
        //    return;
        //}
        if (status === google.maps.GeocoderStatus.OK) {
            resultsMap.setCenter(results[0].geometry.location);
            searchNearbyRest(results[0].geometry.location);
            searchNearbyGroc(results[0].geometry.location);
            createMarkerFromLocation(results[0].geometry.location);
        }
    });
}

function searchNearbyRest(location) 
{
    mapfilter_typ_check = "restaurant";
    var service = new google.maps.places.PlacesService(map);
    /* search for nearby restaurants */
    service.nearbySearch({
        location: { lat: location.lat(), lng: location.lng() },
        keyword: ['indian'],
        radius: 16094,
        types: ['restaurant'],//shows the place on the type
        opennow: true
    }, createMarkersRest);
}

/* if nearby restaus found, create markers for them */
function createMarkersRest(results, status) 
{
    if (status === google.maps.places.PlacesServiceStatus.OK) { /* this status and results are returned by PlacesService call */
        for (var i = 0; i < results.length; i++) {
            createMarkerRest(results[i]);
          // alert("rest1" + "-" + results.length + "current-" + i);
            geocodePlaceIdRest(results[i]);
        }
    }
}

/* this function creates markers */
function createMarkerRest(place) 
{
    service = new google.maps.places.PlacesService(map);
    service.getDetails({
        placeId: place.place_id
    }, function (place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            var marker = new google.maps.Marker({
                map: map,
                animation: google.maps.Animation.DROP,
                icon: {
                    url: "images/discover.png",
                    scaledSize: new google.maps.Size(20, 20)
                },
                position: place.geometry.location
            });
            google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent('<div><a href="/restaurant-details.aspx?restaurant-name=' + place.name + '&place-id=' + place.place_id + '"><strong>' + place.name + '</strong></a><br>' + place.international_phone_number +
              '<br><a href="' + place.website + '" target="_blank">' + place.website + '</a></div>');

                infowindow.open(map, this);
            });
        }
        else if(status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
          var marker = new google.maps.Marker({
              map: map,
              animation: google.maps.Animation.DROP,
              icon: {
                  url: "images/discover.png",
                  scaledSize: new google.maps.Size(20, 20)
              },
              position: place.geometry.location
          });
          google.maps.event.addListener(marker, 'click', function () {
              infowindow.setContent('<div><a href="/restaurant-details.aspx?restaurant-name=' + place.name + '&place-id=' + place.place_id + '"><strong>' + place.name + '</strong></a><br>' + place.international_phone_number +
            '<br><a href="' + place.website + '" target="_blank">' + place.website + '</a></div>');

              infowindow.open(map, this);
          });
        }
    });
}

function geocodePlaceIdRest(place) 
{
    service = new google.maps.places.PlacesService(map);
    service.getDetails({
        placeId: place.place_id
    }, function (place, status) {
        /* For Detail address */
        var restaurant_details, country, state, city, zip;//get country, state, city, zip from address
        for (i = 0; i < place.address_components.length; i++) {
            if (place.address_components[i].types[0] == "country") {
                country = place.address_components[i].long_name;
            }
            if (place.address_components[i].types[0] == "administrative_area_level_1") {
                state = place.address_components[i].short_name;
            }
            if (place.address_components[i].types[0] == "locality") {
                city = place.address_components[i].long_name;
            }
            if (place.address_components[i].types[0] == "postal_code") {
                zip = place.address_components[i].long_name;
            }
        }
        restaurant_details = place.name + '*' + place.international_phone_number + '*' + place.formatted_address + '*' + zip + '*' + city + '*' + state + '*' + country + '*' + place.place_id + '*' + place.url + '*' + place.website;
        if (document.getElementById('hdfMaprestdtl').value == null || document.getElementById('hdfMaprestdtl').value == "") {
            document.getElementById('hdfMaprestdtl').value = restaurant_details;
        }
        else if (document.getElementById('hdfMaprestdtl').value != null || document.getElementById('hdfMaprestdtl').value != "") {
            document.getElementById('hdfMaprestdtl').value = document.getElementById('hdfMaprestdtl').value + '$' + restaurant_details;
        }
        /* For Place id  */
        if (document.getElementById('hdfMaprestPlaceid').value == null || document.getElementById('hdfMaprestPlaceid').value == "") {
            document.getElementById('hdfMaprestPlaceid').value = "'" + place.place_id + "'";
        }
        else if (document.getElementById('hdfMaprestPlaceid').value != null || document.getElementById('hdfMaprestPlaceid').value != "") {
            document.getElementById('hdfMaprestPlaceid').value = document.getElementById('hdfMaprestPlaceid').value + ',' + "'" + place.place_id + "'";
        }
        alert("rest-" + document.getElementById('hdfMaprestPlaceid').value);
    });
}

function searchNearbyGroc(location) 
{
    var service = new google.maps.places.PlacesService(map);
    /* search for nearby restaurants */
    service.nearbySearch({
        location: { lat: location.lat(), lng: location.lng() },
        keyword: ['indian'],
        radius: 16094,
        types: ['grocery_or_supermarket'],//shows the place on the type
        opennow: true
    }, createMarkersGroc);
}

function createMarkersGroc(results, status) 
{
    if (status === google.maps.places.PlacesServiceStatus.OK) { /* this status and results are returned by PlacesService call */
        for (var i = 0; i < results.length; i++) {
            createMarkerGroc(results[i]);
                //alert("groc1" + "-" + results.length+"current-"+i);
                geocodePlaceIdGroc(results[i]);
        }
    }
}

function createMarkerGroc(place) 
{
    service = new google.maps.places.PlacesService(map);
    service.getDetails({
        placeId: place.place_id
    }, function (place, status) {
        //if (status === google.maps.places.PlacesServiceStatus.OK) {
        var marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            icon: {
                url: "images/discover.png",
                scaledSize: new google.maps.Size(20, 20)
            },
            position: place.geometry.location
        });
        google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent('<div><a href="/grocery-details.aspx?grocery-name=' + place.name + '&place-id=' + place.place_id + '"><strong>' + place.name + '</strong></a><br>' + place.international_phone_number +
                                  '<br><a href="' + place.website + '" target="_blank">' + place.website + '</a></div>');
            infowindow.open(map, this);
        });
        //}
    });
}

function geocodePlaceIdGroc(place) 
{
    service = new google.maps.places.PlacesService(map);
    service.getDetails({
        placeId: place.place_id
    }, function (place, status) {
        /* For Detail address */
        var grocery_details, country, state, city, zip;//get country, state, city, zip from address
        for (i = 0; i < place.address_components.length; i++) {
            if (place.address_components[i].types[0] == "country") {
                country = place.address_components[i].long_name;
            }
            if (place.address_components[i].types[0] == "administrative_area_level_1") {
                state = place.address_components[i].short_name;
            }
            if (place.address_components[i].types[0] == "locality") {
                city = place.address_components[i].long_name;
            }
            if (place.address_components[i].types[0] == "postal_code") {
                zip = place.address_components[i].long_name;
            }
        }
        grocery_details = place.name + '*' + place.international_phone_number + '*' + place.formatted_address + '*' + zip + '*' + city + '*' + state + '*' + country + '*' + place.place_id + '*' + place.url + '*' + place.website;
        if (document.getElementById('hdfMapgrocdtl').value == null || document.getElementById('hdfMapgrocdtl').value == "") {
            document.getElementById('hdfMapgrocdtl').value = grocery_details;
        }
        else if (document.getElementById('hdfMapgrocdtl').value != null || document.getElementById('hdfMapgrocdtl').value != "") {
            document.getElementById('hdfMapgrocdtl').value = document.getElementById('hdfMapgrocdtl').value + '$' + grocery_details;
        }
        /* For Place id  */
        if (document.getElementById('hdfMapgrocPlaceid').value == null || document.getElementById('hdfMapgrocPlaceid').value == "") {
            document.getElementById('hdfMapgrocPlaceid').value = "'" + place.place_id + "'";
        }
        else if (document.getElementById('hdfMapgrocPlaceid').value != null || document.getElementById('hdfMapgrocPlaceid').value != "") {
            document.getElementById('hdfMapgrocPlaceid').value = document.getElementById('hdfMapgrocPlaceid').value + ',' + "'" + place.place_id + "'";
        }
        alert("groc"+document.getElementById('hdfMapgrocPlaceid').value);
    });
}

function createMarkerFromLocation(location) 
{
    var marker = new google.maps.Marker({
        map: map,
        //animation: google.maps.Animation.BOUNCE,
        position: location
    });

    /* when user clicks on marker, display info window */
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(document.getElementById('hdfloc').value);
        infowindow.open(map, this);
    });
}

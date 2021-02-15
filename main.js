//var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;
var latitude = 0;
var longitude = 0;

function setPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
}

function btnOne(btnDiv, map) {
    // Set CSS for the control border.
    var btnUI = document.createElement('div');
    btnUI.style.backgroundColor = '#fff';
    btnUI.style.border = '2px solid #fff';
    btnUI.style.borderRadius = '3px';
    btnUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    btnUI.style.cursor = 'pointer';
    btnUI.style.marginBottom = '22px';
    btnUI.style.marginRight = '8px';
    btnUI.style.marginTop = '8px';
    btnUI.style.textAlign = 'center';
    btnUI.title = 'Click to recenter the map';
    btnDiv.appendChild(btnUI);

    // Set CSS for the control interior.
    var btnText = document.createElement('div');
    btnText.style.color = 'rgb(25,25,25)';
    btnText.style.fontFamily = 'Roboto,Arial,sans-serif';
    btnText.style.fontSize = '12px';
    btnText.style.lineHeight = '32px';
    btnText.style.paddingLeft = '5px';
    btnText.style.paddingRight = '5px';
    btnText.innerHTML = 'Click ME';
    btnUI.appendChild(btnText);

    // Setup the click event listeners: simply set the map to Chicago.
    btnUI.addEventListener('click', function() {
        alert('First EiEi');
    });

}


function initAutocomplete() {
	//if (navigator.geolocation) {
	if (false) {
        navigator.geolocation.getCurrentPosition(setPosition);
    } else {
        latitude = 13.7248946;
		longitude = 100.4930262;
    }


	var map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: latitude, lng: longitude},
		zoom: 17,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});




	var trafficLayer = new google.maps.TrafficLayer();
		  trafficLayer.setMap(map);


	// Create the search box and link it to the UI element.
	var input = document.getElementById('pac-input');
	var searchBox = new google.maps.places.SearchBox(input);
	map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

	// Bias the SearchBox results towards current map's viewport.
	map.addListener('bounds_changed', function() {
		searchBox.setBounds(map.getBounds());
	});



	google.maps.event.addListener(map, 'click', function(event) {
		$('textarea#addr_map').val('');
		$('button#del_pic_map_btn').hide();
		$('input#pic_map').val('');
		$('div#filename').text('Choose a file');
		$('div#save_data').dialog({
			resizable: false,
			modal: true,
			width: 500,
			buttons: {
				"Ok": function() {
					if ($('textarea#addr_map').val() != '') {
						var addr_map = $('textarea#addr_map').val().replace("\n", "<br/>");
						addMarker(event.latLng, map, addr_map);
						$( this ).dialog( "close" );
					} else {
						alert("can't submit because value empty");
					}

				},
				"Cancel": function() {
					$( this ).dialog( "close" );
				}
			}
		});
	});

	var markers = [];
	// Listen for the event fired when the user selects a prediction and retrieve
	// more details for that place.
	searchBox.addListener('places_changed', function() {
		var places = searchBox.getPlaces();

		if (places.length == 0) {
			return;
		}

		// Clear out the old markers.
		markers.forEach(function(marker) {
			marker.setMap(null);
		});
		markers = [];

		// For each place, get the icon, name and location.
		var bounds = new google.maps.LatLngBounds();
		places.forEach(function(place) {
			var icon = {
				url: place.icon,
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(25, 25)
			};

			// Create a marker for each place.
			markers.push(new google.maps.Marker({
				map: map,
				icon: icon,
				title: place.name,
				position: place.geometry.location,
			}));

			if (place.geometry.viewport) {
			// Only geocodes have viewport.
				bounds.union(place.geometry.viewport);
			} else {
				bounds.extend(place.geometry.location);
			}
		});
		map.fitBounds(bounds);
	});
}


function addMarker(location, map, addr_map) {
	// Add the marker at the clicked location, and add the next-available label
	// from the array of alphabetical characters.
	var marker = new google.maps.Marker({
		position: location,
		//label: labels[labelIndex++ % labels.length],
		map: map,
		draggable: true
	});
	$(marker).data('addr_map', addr_map);
	readFile($(marker));





	var infowindow = new google.maps.InfoWindow();
	google.maps.event.addListener(marker, 'mouseover', function() {
		if (typeof $(marker).data('pic_map') != "undefined") {
			infowindow.setContent('<div class="img">\
								    <img src="' + $(marker).data('pic_map') + '" width="300" height="200">\
								  <div class="desc">' + $(marker).data('addr_map') + '</div>\
								</div>');
		} else {
			infowindow.setContent('<div>' + $(marker).data('addr_map') + '</div>');
		}

		infowindow.open(map, this);
	});

		google.maps.event.addListener(marker, 'click', function(event) {
			//ลบmaker
	});


	google.maps.event.addListener(marker, 'mouseout', function() {
		infowindow.close(map, this);
	});
}


function readFile(marker) {
	if ($('input#pic_map').prop("files")[0]) {
		var FR = new FileReader();
		FR.onload = function(e) {
			marker.data('pic_map', e.target.result);
		};
		FR.readAsDataURL( $('input#pic_map').prop("files")[0] );
	}
}

$(document).ready(function(){
	$('label#pic_map_btn').button({
		icons: {
			primary: "ui-icon-image"
		}
	});

	$('button#del_pic_map_btn').button({
		icons: {
			primary: "ui-icon-trash"
		},
		text: false
    });

	$('input#pic_map').on('change', function(){
		oFile = $(this).prop("files")[0];
		$('div#filename').text(oFile.name);
		$('button#del_pic_map_btn').show();
	});

	$('button#del_pic_map_btn').on('click', function(){
		$('button#del_pic_map_btn').hide();
		$('input#pic_map').val('');
		$('div#filename').text('Choose a file');
	});
});

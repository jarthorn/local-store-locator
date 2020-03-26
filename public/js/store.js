/*global google Tabletop*/
/*eslint-env browser */

/**
 * Returns a string of information about a given business
 * @param {Object} data The business object
 * @return {String} An information string about the business
 */
function buildContent( data ){
	var website = data.website;
	if (!website) {
		//default to a google search if there is no known web site
		website = "https://www.google.ca/?gws_rd=ssl#q=" + data.business;
	}
	var contentString = '<table class="table table-bordered">' +
							'<tbody>' +
								'<tr>' + 
									'<th>Business</th>' +
									'<td><a href="' + website + '" target="_blank">' + data.business + ' </a>' + '</td>' +
								'</tr>' +
								'<tr>' + 
									'<th>What\'s available</th>' +
									'<td>' + data.available+ '</td>' +
								'</tr>' +
							'</tbody>' +
						'<table>';
	
	return contentString;
}


/**
 * Plots information about a single business on a map
 * @param {Object} business A single business from the database
 */
function plot(business){
	if (!(business.latitude && business.longitude))
		return;
	var position = new google.maps.LatLng ( business.latitude, business.longitude );
	var weight = business["public"] === 'Yes' ? 10 : 5;//larger weight to businesss that are known to be open to the public
	var marker = new google.maps.Marker({
		position: position,
		icon: {
			path: google.maps.SymbolPath.CIRCLE,
			fillOpacity: 0.7,
			fillColor: "#a31720",
			strokeOpacity: 0.9,
			strokeColor: "#a31720",
			strokeWeight: 2,
			scale: weight   //pixels
		},
		title: business.business,
		map: this.map
	});
	

	var that = this;
	google.maps.event.addListener(marker, 'click', function() {
		that.popup.setContent( buildContent(business) );
		that.popup.open(that.map, marker);
	});
}

/**
 * Creates a map and plots data from the provided spreadsheet on the map.
 * @param {Object} data The spreadsheet data object from tabletop.
 */
function showInfo(data) {
	
	var styles = [
	  {
	    "featureType": "road",
	    "elementType": "labels",
	    "stylers": [
	      { "visibility": "off" }
	    ]
	  },{
	    "featureType": "administrative.locality",
	    "elementType": "labels",
	    "stylers": [
	      { "visibility": "off" }
	    ]
	  },{
	    "featureType": "administrative.neighborhood",
	    "elementType": "labels",
	    "stylers": [
	      { "visibility": "off" }
	    ]
	  },{
	    "featureType": "poi",
	    "elementType": "labels",
	    "stylers": [
	      { "visibility": "off" }
	    ]
	  },{
	    "featureType": "road",
	    "stylers": [
	      { "saturation": -67 },
	      { "weight": 0.7 },
	      { "lightness": 15 }
	    ]
	  },{
	    "featureType": "water",
	    "stylers": [
	      { "lightness": -24 }
	    ]
	  }
	];

    var mapOptions = {
		mapTypeControlOptions: { mapTypeIds: [ 'Styled'] },
		center: new google.maps.LatLng( 45.42153, -75.69 ),//start in ottawa
		zoom: 7,
		mapTypeId: 'Styled'
	};

	//create and style the map
	var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);	
	var styledMapType = new google.maps.StyledMapType( styles, { name: 'Neighbourhood business' } );
    map.mapTypes.set('Styled', styledMapType);  
    
    //create popup window that will be used when clicking markers
    var popup = new google.maps.InfoWindow();
    
    //plot each team on the map
    var that = {map: map, popup: popup};
    data.TEST.elements.forEach(plot, that);
}

window.onload = function() {
  var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1asa5VMdHOr4LTOx34EPGxkN90Oy48niuPjCQu83cx_s/edit?usp=sharing';

  Tabletop.init({ key: spreadsheet, callback: showInfo});
};

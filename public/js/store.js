/*global google Tabletop*/
/*eslint-env browser */

/**
 * Returns a string of information about a given business
 * @param {Object} data The business object
 * @return {String} An information string about the business
 */
function buildContent( data ){
	var website = data.WebsiteURL;
	if (!website) {
		//default to a google search if there is no known web site
		website = "https://www.google.ca/?gws_rd=ssl#q=" + data.Business;
	}
	var websiteText = '<a href="' + website + '" target="_blank">' + data.Business + ' </a>'
	var details = data["What is available"] || data["Open?"]
	var facebookText = ""
	if (data.FacebookURL) {
		facebookText = '<a href="' + data.FacebookURL + '" target="_blank"> (Facebook)</a>'
	}

	var contentString = '<table class="table table-bordered">' +
							'<tbody>' +
								'<tr>' + 
									'<th>Business</th>' +
									'<td>' + websiteText + facebookText + '</td>' +
								'</tr>' +
								'<tr>' +
									'<th>What\'s available</th>' +
									'<td>' + details + '</td>' +
								'</tr>' +
								'<tr>' +
									'<th>Phone</th>' +
									'<td>' + data.Phone + '</td>' +
								'</tr>' +
								'<tr>' +
									'<th>Address</th>' +
									'<td>' + data.Address + '</td>' +
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
	if (!(business.Latitude && business.Longitude))
		return;
	var position = new google.maps.LatLng ( business.Latitude, business.Longitude );
  var icon_path = business["Open?"] === 'Open' ? "../images/open.svg" : "../images/closed.svg"
	var marker = new google.maps.Marker({
		position: position,
		icon: icon_path,
		title: business.Business,
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
		zoom: 11,
		mapTypeId: 'Styled'
	};

	//create and style the map
	var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);	
	var styledMapType = new google.maps.StyledMapType(styles);
    map.mapTypes.set('Styled', styledMapType);  
    
    //create popup window that will be used when clicking markers
    var popup = new google.maps.InfoWindow();
    
    //plot each team on the map
    var that = {map: map, popup: popup};
    data.Master.elements.forEach(plot, that);
}

window.onload = function() {
  var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1asa5VMdHOr4LTOx34EPGxkN90Oy48niuPjCQu83cx_s/edit?usp=sharing';

  Tabletop.init({ key: publicSpreadsheetUrl, callback: showInfo});
};

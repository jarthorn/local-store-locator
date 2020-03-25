/*global google Tabletop*/
/*eslint-env browser */

/**
 * Returns a string of information about a given historic site
 * @param {Object} data The historic site object
 * @return {String} An information string about the historic site
 */
function buildContent( data ){
	var website = data.website;
	if (!website) {
		//default to a google search if there is no known web site
		website = "https://www.google.ca/?gws_rd=ssl#q=" + data.site + " National Historic Site";
	}
	var contentString = '<table class="table table-bordered">' +
							'<tbody>' +
								'<tr>' + 
									'<th>Historic Site</th>' + 
									'<td><a href="' + website + '" target="_blank">' + data.site + ' </a>' + '</td>' +
								'</tr>' +
								'<tr>' + 
									'<th>Description</th>' + 
									'<td>' + data.description+ '</td>' +
								'</tr>' +
							'</tbody>' +
						'<table>';
	
	return contentString;
}


/**
 * Plots information about a single historic site on a map
 * @param {Object} site A single historic site from the database
 */
function plot(site){
	if (!(site.latitude && site.longitude))
		return;
	var position = new google.maps.LatLng ( site.latitude, site.longitude );
	var weight = site["public"] === 'Yes' ? 10 : 5;//larger weight to sites that are known to be open to the public
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
		title: site.site,
		map: this.map
	});
	

	var that = this;
	google.maps.event.addListener(marker, 'click', function() {
		that.popup.setContent( buildContent(site) );
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
	var styledMapType = new google.maps.StyledMapType( styles, { name: 'National Historic Sites' } );
    map.mapTypes.set('Styled', styledMapType);  
    
    //create popup window that will be used when clicking markers
    var popup = new google.maps.InfoWindow();
    
    //plot each team on the map
    var that = {map: map, popup: popup};
    data.sites.elements.forEach(plot, that);
}

window.onload = function() {
//    var spreadsheet = '1icgNyHLS6kuVONHgL473dgo4l-Dc4k7DqZnO564dnBw';  //hand crafted data set
    var spreadsheet = '17Luid_Y-nWw0IazEApPHJUSHUo3UNQxa7NhzIbRhXk0';
    
    
    Tabletop.init({ key: spreadsheet, callback: showInfo});
};
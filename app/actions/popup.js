import React from 'react';
import jQuery from 'jquery';

var popupClick = function(coords) {
	var url = '/popup/';
	jQuery.post(url, {"lat" : coords.lat, "lng": coords.lng});
}

export {popupClick};

import React from 'react';
import ReactDOM from 'react-dom';
import App from '../assets/src/js/h5p-new';
import '../assets/src/css/h5p-new.scss';

var div = document.getElementById('h5p-content-form');
div.insertAdjacentHTML('beforeend', '<div id=\"h5p-ownership-transfer\" class=\"postbox h5p-sidebar\"></div>');
div.insertAdjacentHTML('beforeend', "");

ReactDOM.render(
	<App tags={[]} />,
	// eslint-disable-next-line no-undef
	document.getElementById( 'h5p-ownership-transfer' )
);

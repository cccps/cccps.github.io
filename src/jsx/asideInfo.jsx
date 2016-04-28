var React = require('react');

var Constants = require('../js/constants');

var AppDispatcher = window.AppDispatcher;
var AppStore = window.AppStore;

var Palette = require('./palette.jsx');
var Layers = require('./layers.jsx');


var AsideInfo = React.createClass({
	// componentDidMount: function() {
	// 	// AppStore.addChangeListener(Constants.AT_FILE_SELECT,this.select);
	// },
 //    componentWillUnmount: function() {
 //    	// AppStore.removeChangeListener(Constants.AT_FILE_SELECT,this.select);
 //    },

	render : function(){
		return (
			<section id='asideInfo'>
                <Palette />
                <Layers />
            </section>
		);
	}
});

module.exports = AsideInfo;
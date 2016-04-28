require('../less/index.less');

var React = require('react');

//dispatch store
var AppDispatcher = require('../js/dispatcher/AppDispatcher');
window.AppDispatcher = AppDispatcher;

var AppStore = require('../js/stores/AppStore');
window.AppStore = AppStore;

//components
var Menu = require('./menu.jsx');
var ToolOptions = require('./toolOptions.jsx');
var AsideTools = require('./asideTools.jsx');
var MainCanvas = require('./mainCanvas.jsx');
var FileSelector = require('./fileSelector.jsx');
var AsideInfo = require('./asideInfo.jsx');


var MaskNewFile = require('./maskNewFile.jsx');
var MaskFileInfo = require('./maskFileInfo.jsx');
var MyAlert = require('./myAlert.jsx');


var App = React.createClass({
	menuInactive:function(e){
		this.refs.menu.inactive();
	},
	render : function(){
		return (
			<div id='app' onClick={this.menuInactive}>
				<Menu ref='menu'/>
				<ToolOptions ref='toolOptions'/>
				<AsideTools />
				<AsideInfo />

				<MainCanvas />
				
				<FileSelector />
				<MaskNewFile />
				<MaskFileInfo/>
				<MyAlert />
			</div>
		);
	}
})

module.exports = App;
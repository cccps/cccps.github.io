// require('../less/asidetools.less');

var React = require('react');
var Config = require('../js/config');
var Constants = require('../js/constants');

var ListenerMixins = require('../js/mixins/ListenerMixins');

var AppDispatcher = window.AppDispatcher;
var AppStore = window.AppStore;

var AsideToolsItem = React.createClass({
	activeTool : function(){
		if(!this.props.active){
			AppDispatcher.handleViewAction({
				'name' : Constants.AT_TOOL_ACTIVE,
				'tool_name' : this.props.tool
			});
		}
	},
	render : function(){
		var style = {
			backgroundImage:'url('+this.props.icon+')'
		};
		var classes = 'asideToolsItem'+(this.props.active ? ' active':'');
		return (
			<div className={classes}>
				<a  title={this.props.name} style={style} onClick={this.activeTool}></a>
			</div>
		)
	}
})


var AsideTools = React.createClass({
	mixins:[ListenerMixins],
	_listeners:[
	    Constants.AT_TOOL_ACTIVE
	],
	_callback:function(){
		this.setState({
			'activeTool' : AppStore.getConfig('tool')
		})
	},
	getInitialState:function() {
		var state = Config.AsideTools;
		state.activeTool = AppStore.getConfig('tool');
	    return state;
	},
	render : function(){
		var self = this;
		var nodes = [];
		this.state.fn.forEach(function(item,index){
			nodes.push(<AsideToolsItem key={'asideToolsItem'+index} tool={item.tool} name={item.name} 
				items={item.items} icon={item.icon} active={item.tool == self.state.activeTool} tool={item.tool}/>);
		})

		return (
			<div id='asideTools'>
				{nodes}
			</div>
		)
	}
})

module.exports = AsideTools;
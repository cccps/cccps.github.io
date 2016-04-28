// require('../less/toolOptions.less');

var React = require('react');
var Constants = require('../js/constants');
var Config = require('../js/config');

var ListenerMixins = require('../js/mixins/ListenerMixins');

var AppDispatcher = window.AppDispatcher;
var AppStore = window.AppStore;

var CheckboxOption = React.createClass({
	handleCheck : function(){
		AppDispatcher.handleViewAction({
			'name' : this.props.info.action_name,
			'data' : {
				'conf_name' : this.props.info.conf_name,
				'checked' : this.refs.checkbox.checked
			}
		});
	},
	componentDidUpdate : function(prevProps, prevState){
		if(this.props.info.checked){
			this.refs.checkbox.setAttribute('checked','checked');
		}else{
			this.refs.checkbox.removeAttribute('checked');
		}
	},
	render : function(){
		return(
			<label className='checkboxOption'>
				<span>{this.props.info.name}</span>
				<input ref='checkbox' type="checkbox" className='op_checkbox' checked={this.props.info.checked} onChange={this.handleCheck}/>
				<span className='op_checkbox_fake'></span>
			</label>
		);
	}
})

var SelectOption = React.createClass({
	handleSelect : function(){
		AppDispatcher.handleViewAction({
			'name' : this.props.info.action_name,
			'data' : {
				'conf_name' : this.props.info.conf_name,
				'select_type' : this.props.info.select_type,
				'value' : this.refs.select.value
			}
		});
	},
	render: function(){
		var nodes = [];
		if( this.props.info.select_type == 'number' ){
			var min = this.props.info.range[0],
				max = this.props.info.range[1];
			for(var i = min ; i <= max ; i++){
				nodes.push(<option key={'option-'+i} value={i}>{i}</option>);
			}
		}else if( this.props.info.select_type == 'text' ){
			for(var i = 0,len = this.props.info.range.length; i < len ; i++){
				nodes.push(<option key={'option-'+i} value={this.props.info.range[i]}>{this.props.info.range_name[i]}</option>);
			}
		}
		
		return(
			<div className='selectOption'>
				<span>{this.props.info.name}</span>
				<select ref='select' className='op_select' value={this.props.info.value} onChange={this.handleSelect}>
					{nodes}
				</select>
			</div>
		);
	}
})

var ToolOptions = React.createClass({
	mixins:[ListenerMixins],
	_listeners:[
	   Constants.AT_TOOL_ACTIVE,
	   Constants.AT_TOOL_CHECKBOX,
	   Constants.AT_TOOL_SELECT
	],
	_callback : function(){
		this.setState(this.getToolConfig);
	},
	getToolConfig : function(){
		var _tool = AppStore.getConfig('tool'),
			_tools = Config.AsideTools.fn;
		var toolConfig;
		for( var i = 0, len = _tools.length; i < len ; i++ ){
			if( _tools[i].tool == _tool ){
				toolConfig = _tools[i]
				break;
			}
		}
	    return toolConfig;
	},
	getInitialState : function() {
		return this.getToolConfig();
	},
	render : function(){
		var nodes = [];
		var _conf = AppStore.getConfig();
		var options = this.state.options,
			len = options.length;
		for(var i = 0; i < len ; i++){
			if(options[i].type == 'checkbox'){
				options[i]['checked'] = _conf[options[i].conf_name];
				nodes.push(<CheckboxOption key={'option-'+i}  info={options[i]} />);
			}else if(options[i].type == 'select'){
				options[i]['value'] = _conf[options[i].conf_name];
				nodes.push(<SelectOption key={'option-'+i}  info={options[i]} />);
			}
		}

		return(
			<div id='toolOptions'>
				{nodes}
			</div>
		);
	}
})


module.exports = ToolOptions;
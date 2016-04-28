var React = require('react');

var Constants = require('../js/constants');

var AppDispatcher = window.AppDispatcher;
var AppStore = window.AppStore;


var FileSelector = React.createClass({
	componentDidMount: function() {
        AppStore.addChangeListener(Constants.AT_FILE_SELECT,this.select.bind(this,Constants.AT_FILE_SELECT));
		AppStore.addChangeListener(Constants.AT_FILE_SELECT_ADD,this.select.bind(this,Constants.AT_FILE_SELECT_ADD));
	},
    componentWillUnmount: function() {
        AppStore.removeChangeListener(Constants.AT_FILE_SELECT,this.select);
    	AppStore.removeChangeListener(Constants.AT_FILE_SELECT_ADD,this.select);
    },
    select:function(type){
        this.setState({
            'type' : type
        })
    	this.refs.selector.click();
    },
    selected:function(e){
        var action_name;
        if(this.state.type == Constants.AT_FILE_SELECT){
            action_name = Constants.AT_DATA_FILE_SELECT;
        }else if(this.state.type == Constants.AT_FILE_SELECT_ADD){
            action_name = Constants.AT_DATA_FILE_SELECT_ADD;
        }


    	AppDispatcher.handleViewAction({
    		'name' : action_name,
    		'data' : this.refs.selector.files[0]
    	})
    	this.refs.selector.value = '';//清空选择的图片
    },
	render : function(){
		return(
			<input id='fileSelector' ref='selector' type='file' accept="image/*" onChange={this.selected}></input>
		)
	}
})


module.exports = FileSelector;
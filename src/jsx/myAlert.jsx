// require('../less/toolOptions.less');

var React = require('react');
var Constants = require('../js/constants');

var AppDispatcher = window.AppDispatcher;
var AppStore = window.AppStore;



var MyAlert = React.createClass({
	getInitialState : function(){
		return {
			show : false,
			content : ''
		};
	},

	componentDidMount: function() {
		AppStore.addChangeListener(Constants.AT_ALERT,this.show);
	},
    componentWillUnmount: function() {
    	AppStore.removeChangeListener(Constants.AT_ALERT,this.show);
    },
    show:function(){
    	this.setState({
    		show:true,
    		content:AppStore.getAlert()
    	});
    },
    hide:function(){
    	this.setState({show:false});
    },
	render : function(){
		var style = {
			display :  this.state.show ? 'block':'none'
		};
		return(
			<section className='mask' style={style}>
				<div className='mask_box'>
					<div className='mask_title'>
						<p className='mask_title_t'>提示</p>
						<a  onClick={this.hide}></a>
					</div>
					<div className='mask_content'>
						<p>{this.state.content}</p>
						<a className='mask_btn_close' onClick={this.hide}>确定</a>
					</div>		
				</div>	
			</section>
		)
	}
})


module.exports = MyAlert;
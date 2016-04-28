// require('../less/toolOptions.less');

var React = require('react');
var Constants = require('../js/constants');

var AppDispatcher = window.AppDispatcher;
var AppStore = window.AppStore;



var MaskFileInfo = React.createClass({

	getInitialState : function(){
		return {
			show :false,
			id :null,
			name:'',
			width:0,
			height:0
		};
	},
	handleChange: function(ref,event) {
		var newState = {};
		newState[ref] = event.target.value;
	    this.setState(newState);
	},
	handleNew : function(){
		if(!this.state.name || this.state.width <= 0 || this.state.height <= 0 ){
			AppDispatcher.handleViewAction({
				'name' : Constants.AT_ALERT,
				'data' : {
					'content' : '输入不合法'
				}
			});
			return;
		}
		AppDispatcher.handleViewAction({
			'name' : Constants.AT_DATA_FILE_INFO,
			'data':{
				'id' : this.state.id,
				'name' : this.state.name, 
				'width' : parseInt(this.state.width, 10),
				'height' : parseInt(this.state.height, 10)  
			}
		})
		this.hide();
	},
	componentDidMount: function() {
		AppStore.addChangeListener(Constants.AT_FILE_INFO,this.show);
	},
    componentWillUnmount: function() {
    	AppStore.removeChangeListener(Constants.AT_FILE_INFO,this.show);
    },
    show:function(){
    	var activeFile = AppStore.getActiveFile();
    	this.setState({
    		show:true,
    		id : activeFile.id,
    		name : activeFile.fileName,
    		width : activeFile.width,
    		height : activeFile.height
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
						<p className='mask_title_t'>文档信息</p>
						<a  onClick={this.hide}></a>
					</div>
					<div className='mask_content'>
						<div className='mask_nf_right'>
							<a  className='mask_nf_ensure' onClick={this.handleNew}>确定</a>
							<a  className='mask_nf_cancel' onClick={this.hide}>取消</a>
						</div>	
						<div className='mask_nf_left'>
							<div className='mask_nf_name'>
								名称:<input type='text' ref='name' onChange={this.handleChange.bind(this,'name')} value={this.state.name}/>
							</div>
							<div className='mask_nf_width'>
								宽度:<input type='number' ref='width'  onChange={this.handleChange.bind(this,'width')} value={this.state.width}/>
							</div>
							<div className='mask_nf_height'>
								高度:<input type='number' ref='height' onChange={this.handleChange.bind(this,'height')} value={this.state.height}/>
							</div>
						</div>	
					</div>		
				</div>	
			</section>
		)
	}
})


module.exports = MaskFileInfo;
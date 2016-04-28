// require('../less/maincanvas.less');

var React = require('react');
var Constants = require('../js/constants');
var Utils = require('../js/utils');

var ListenerMixins = require('../js/mixins/ListenerMixins');
var Strategy = require('../js/strategy');


var AppDispatcher = window.AppDispatcher;
var AppStore = window.AppStore;

var ActiveLayerCanvas = React.createClass({
	data:{
		'x' : null,
		'y' : null
	},
	componentDidMount: function() {
		this.paint();
		AppStore.addChangeListener(Constants.AT_TOOL_DRAW,this.drawPainting);
		AppStore.addChangeListener(Constants.AT_TOOL_DRAW_UP,this.handleDraw);
		AppStore.addChangeListener(Constants.AT_TOOL_LINE,this.drawingLine);
		AppStore.addChangeListener(Constants.AT_TOOL_LINE_UP,this.handleLine);

		AppStore.addChangeListener(Constants.AT_TOOL_RECTANGLE,this.drawingRectangle);
		AppStore.addChangeListener(Constants.AT_TOOL_RECTANGLE_UP,this.handleRectangle);
		AppStore.addChangeListener(Constants.AT_TOOL_ELLIPSE,this.drawingEllipse);
		AppStore.addChangeListener(Constants.AT_TOOL_ELLIPSE_UP,this.handleEllipse);
	},
	componentWillUnmount: function() {
		AppStore.removeChangeListener(Constants.AT_TOOL_DRAW,this.drawPainting);
		AppStore.removeChangeListener(Constants.AT_TOOL_DRAW_UP,this.handleDraw);
		AppStore.removeChangeListener(Constants.AT_TOOL_LINE,this.drawingLine);
		AppStore.removeChangeListener(Constants.AT_TOOL_LINE_UP,this.handleLine);

		AppStore.removeChangeListener(Constants.AT_TOOL_RECTANGLE,this.drawingRectangle);
		AppStore.removeChangeListener(Constants.AT_TOOL_RECTANGLE_UP,this.handleRectangle);
		AppStore.removeChangeListener(Constants.AT_TOOL_ELLIPSE,this.drawingEllipse);
		AppStore.removeChangeListener(Constants.AT_TOOL_ELLIPSE_UP,this.handleEllipse);
	},
	componentDidUpdate:function(prevProps,prevState){
		this.paint();
	},
	paint: function(){
		var layer = this.props.activelayer;
		if(layer && layer.data){
			var ct = this.refs.activelayer.getContext('2d');
			ct.clearRect(0,0,layer.width,layer.height);
			if(layer.show){
				var temCanvas = Utils.imageDataToCanvas(layer.data);
				ct.drawImage(temCanvas,0,0,layer.width,layer.height);
			}
		}
	},
	drawPainting:function(){//画笔和橡皮擦
		if(!this.props.activelayer || !this.props.activelayer.show){
			return ;
		}
		var _conf = AppStore.getConfig();
		var tool = _conf.tool;
		var al = this.refs.activelayer;
		var ct = al.getContext('2d');
		ct.save();
		if(tool == 'pencil'){
			ct.strokeStyle = Utils.arrayToRgbString(_conf.color);
			ct.fillStyle = Utils.arrayToRgbString(_conf.color);
			ct.lineWidth = _conf.pencil_size;
		}else if(tool == 'rubber'){
			ct.globalCompositeOperation = 'destination-out';
			ct.lineWidth = _conf.rubber_size;
		}

		if(_conf[tool+'_linecap'] == 'square'){
			ct.lineCap = "butt";
		}else if(_conf[tool+'_linecap'] == 'round'){
			ct.lineCap = "round";
		}
		ct.beginPath();

		var confX = _conf.x - this.props.activelayer.left,
		    confY = _conf.y - this.props.activelayer.top;

		if(this.data.x && this.data.y){
			ct.moveTo(this.data.x,this.data.y);
			ct.lineTo(confX,confY);
			ct.stroke();
		}else{
			ct.moveTo(confX,confY);
			if(_conf[tool+'_linecap'] == 'square'){
				ct.fillRect(confX - ct.lineWidth/2,confY - ct.lineWidth/2,ct.lineWidth,ct.lineWidth)
			}else if(_conf[tool+'_linecap'] == 'round'){
				ct.arc(confX,confY,ct.lineWidth/2,0,Math.PI*2,false);
				ct.fill();
			}
		}	
		
		this.data.x = confX;
		this.data.y = confY;
		
		ct.restore();

		this.dispatch(Constants.AT_TOOL_DRAW_PAINTING);
	},
	handleDraw:function(){

		this.data.x = null;
		this.data.y = null;

		if(!this.props.activelayer || !this.props.activelayer.show){
			return ;
		}

		this.dispatch(Constants.AT_TOOL_DRAW_HANDLE);
	},
	drawingLine:function(){
		if(!this.props.activelayer || !this.props.activelayer.show){
			return ;
		}

		var _conf = AppStore.getConfig();
		var al = this.refs.activelayer;
		var ct = al.getContext('2d');

		ct.save();

		ct.clearRect(0,0,al.width,al.height);
		var srcLayer = _conf.srcHandlingLayer || this.props.activelayer;
		var temCanvas = Utils.imageDataToCanvas(srcLayer.data);
		ct.drawImage(temCanvas,0,0,al.width,al.height);

		ct.strokeStyle = Utils.arrayToRgbString(_conf.color);
		ct.lineWidth = _conf.line_size;
		if(_conf['line_linecap'] == 'square'){
			ct.lineCap = "butt";
		}else if(_conf['line_linecap'] == 'round'){
			ct.lineCap = "round";
		}

		if(_conf['line_style'] == 'dash'){
			ct.setLineDash([ct.lineWidth*2, ct.lineWidth*2]);
		}

		ct.beginPath();

		var confX = _conf.x - this.props.activelayer.left,
		    confY = _conf.y - this.props.activelayer.top;

		if(this.data.x && this.data.y){
			ct.moveTo(this.data.x,this.data.y);
			ct.lineTo(confX,confY);
			ct.stroke();
			this.dispatch(Constants.AT_TOOL_LINE_PAINTING);
		}else{
			this.data.x = confX;
			this.data.y = confY;
		}
		
		
		ct.restore();
	},
	handleLine:function(){
		this.data.x = null;
		this.data.y = null;

		if(!this.props.activelayer || !this.props.activelayer.show){
			return ;
		}

		this.dispatch(Constants.AT_TOOL_LINE_HANDLE);
	},
	drawingRectangle:function(){
		if(!this.props.activelayer || !this.props.activelayer.show){
			return ;
		}

		var _conf = AppStore.getConfig();
		var al = this.refs.activelayer;
		var ct = al.getContext('2d');

		ct.save();

		ct.clearRect(0,0,al.width,al.height);
		var srcLayer = _conf.srcHandlingLayer || this.props.activelayer;
		var temCanvas = Utils.imageDataToCanvas(srcLayer.data);
		ct.drawImage(temCanvas,0,0,al.width,al.height);

		var confX = _conf.x - this.props.activelayer.left,
		    confY = _conf.y - this.props.activelayer.top;

		ct.lineWidth = _conf.rectangle_size;


		if(this.data.x && this.data.y){
			if(_conf['rectangle_style'] == 'stroke'){
				ct.strokeStyle = Utils.arrayToRgbString(_conf.color);
				ct.strokeRect(this.data.x,this.data.y,confX-this.data.x,confY-this.data.y);

			}else if(_conf['rectangle_style'] == 'fill'){
				ct.fillStyle = Utils.arrayToRgbString(_conf.color);
				ct.fillRect(this.data.x,this.data.y,confX-this.data.x,confY-this.data.y);
			}
			this.dispatch(Constants.AT_TOOL_RECTANGLE_PAINTING);
		}else{
			this.data.x = confX;
			this.data.y = confY;
		}
		
		ct.restore();
	},
	handleRectangle:function(){
		this.data.x = null;
		this.data.y = null;

		if(!this.props.activelayer || !this.props.activelayer.show){
			return ;
		}

		this.dispatch(Constants.AT_TOOL_RECTANGLE_HANDLE);
	},
	drawingEllipse:function(){
		if(!this.props.activelayer || !this.props.activelayer.show){
			return ;
		}

		var _conf = AppStore.getConfig();
		var al = this.refs.activelayer;
		var ct = al.getContext('2d');

		ct.save();

		ct.clearRect(0,0,al.width,al.height);
		var srcLayer = _conf.srcHandlingLayer || this.props.activelayer;
		var temCanvas = Utils.imageDataToCanvas(srcLayer.data);
		ct.drawImage(temCanvas,0,0,al.width,al.height);

		var confX = _conf.x - this.props.activelayer.left,
		    confY = _conf.y - this.props.activelayer.top;

		ct.lineWidth = _conf.ellipse_size;


		if(this.data.x && this.data.y){
			ct.beginPath();
			ct.ellipse( (this.data.x+confX)/2,(this.data.y+confY)/2 , Math.abs(confX-this.data.x)/2, Math.abs(confY-this.data.y)/2, 0,0, Math.PI*2);
		    if(_conf['ellipse_style'] == 'stroke'){
				ct.strokeStyle = Utils.arrayToRgbString(_conf.color);
				ct.stroke();
		    }
		    else if(_conf['ellipse_style'] == 'fill'){
				ct.fillStyle = Utils.arrayToRgbString(_conf.color);
				ct.fill();
			}
			this.dispatch(Constants.AT_TOOL_ELLIPSE_PAINTING);
		}else{
			this.data.x = confX;
			this.data.y = confY;
		}
		
		ct.restore();
	},
	handleEllipse:function(){
		this.data.x = null;
		this.data.y = null;

		if(!this.props.activelayer || !this.props.activelayer.show){
			return ;
		}

		this.dispatch(Constants.AT_TOOL_ELLIPSE_HANDLE);
	},

	dispatch:function(name){
		var al = this.refs.activelayer,
			ct_al = al.getContext('2d');

		AppDispatcher.handleViewAction({
			'name' : name,
			'data' : {
				'layer_id' : this.props.activelayer.id,
				'image_data' : ct_al.getImageData(0,0,al.width,al.height)
			}
		})
	},
	render:function(){
		var layer = this.props.activelayer; 
		var width = layer && layer.width || 0;
		var height = layer &&  layer.height || 0;

		var style ={
			'left' : (layer && layer.left || 0) +'px',
			'top' : (layer && layer.top || 0) +'px',
			'width' : width +'px',
			'height' : height +'px'
		};
		return(
			<canvas id='activelayer' ref='activelayer' style={style} width={width} height={height}></canvas>
		);
	}
})

var PaintCanvas = React.createClass({
	mixins:[ListenerMixins],
	_listeners:[
	    Constants.AT_DATA_FILE_NEW,
	    Constants.AT_DATA_FILE_SELECT,
	    Constants.AT_DATA_FILE_SELECT_ADD,
	    Constants.AT_DATA_FILE_ACTIVE,
	    Constants.AT_DATA_FILE_CLOSE,
	    Constants.AT_DATA_FILE_INFO,
	    Constants.AT_DATA_LAYER_ACTIVE,
	    Constants.AT_DATA_LAYER_TOGGLE_SHOW,
	    Constants.AT_DATA_LAYER_ADD,
	    Constants.AT_DATA_LAYER_DEL,
	    Constants.AT_DATA_LAYER_COPY,
	    Constants.AT_DATA_LAYER_UPGRADE,
	    Constants.AT_DATA_LAYER_DEGRADE,
	    Constants.AT_DATA_LAYER_TOP,
	    Constants.AT_DATA_LAYER_BOTTOM,
	    Constants.AT_DATA_LAYER_LARGER,
	    Constants.AT_DATA_LAYER_SMALLER,
	    Constants.AT_DATA_LAYER_ANTICLOCKWISE,
	    Constants.AT_DATA_LAYER_CLOCKWISE,
	    Constants.AT_DATA_LAYER_GRAYING,
	    Constants.AT_DATA_LAYER_OPPOSITION,
	    Constants.AT_DATA_LAYER_PIXELATE,
	    Constants.AT_DATA_LAYER_BLUR,
	    
	    Constants.AT_TOOL_MOVE,
	    Constants.AT_TOOL_DRAW_PAINTING,
	    Constants.AT_TOOL_DRAW_HANDLE,
	    Constants.AT_TOOL_LINE_PAINTING,
	    Constants.AT_TOOL_LINE_HANDLE,

	    Constants.AT_TOOL_RECTANGLE_PAINTING,
	    Constants.AT_TOOL_RECTANGLE_HANDLE,
	    Constants.AT_TOOL_ELLIPSE_PAINTING,
	    Constants.AT_TOOL_ELLIPSE_HANDLE,


	    Constants.AT_DATA_PREV,
	    Constants.AT_DATA_NEXT
	],
	_callback:function(){
	    this.show();  
	},
	data:{
		layerDashLineInterval:null
	},
	componentDidMount: function() {
		var tool = AppStore.getConfig('tool');
		this.setState({
			'tool':tool
		});
		this.loadStrategy();
		AppStore.addChangeListener(Constants.AT_TOOL_ACTIVE,this.loadStrategy);
	},
	componentWillUnmount: function() {
		AppStore.removeChangeListener(Constants.AT_TOOL_ACTIVE,this.loadStrategy);
		Strategy.unload(this.state.tool);
	},
	loadStrategy:function(){
		var tool = AppStore.getConfig('tool');
		if(tool == this.state.tool){
			return ;
		}
		this.state.tool && Strategy.unload(this.state.tool);

		Strategy.load(tool,this.refs.paintcanvas);

		this.setState({
			'tool':tool
		});
	},
	paint:function(){
		var ct = this.refs.paintcanvas.getContext('2d');
		ct.clearRect(0,0,this.refs.paintcanvas.width,this.refs.paintcanvas.height);
		var temCanvas;
		this.clearDash();
		for(var i = this.state.layers.length-1;i>=0;i--){
			var layer = this.state.layers[i];
			if(layer.show && layer.data){
				temCanvas = Utils.imageDataToCanvas(layer.data);
				ct.drawImage(temCanvas,layer.left,layer.top,layer.width,layer.height );	
			}
		}
		this.state.activelayer && this.state.activelayer.show && this.drawDash(this.state.activelayer);

		var maincanvas = document.getElementById('maincanvas')
		Ps.destroy(maincanvas);
		Ps.initialize(maincanvas);
	},
	drawDash: function(layer){
		var self = this;

		var offset = 0;

		_drawDash();

		this.data.layerDashLineInterval = setInterval(function(){
			offset++;
			if (offset > 48) {
			   offset = 0;
			}
			_drawDash();
		},100);

		function _drawDash(){
			var temct = self.refs.dashcanvas.getContext('2d');
			temct.clearRect(0,0,self.refs.dashcanvas.width,self.refs.dashcanvas.height);
			temct.save();
			temct.setLineDash([6,6]);
			temct.lineDashOffset = -offset;
			temct.strokeStyle = '#000';
			temct.lineWidth = 1;
			temct.strokeRect(layer.left,layer.top,layer.width,layer.height);
			temct.restore();
		}
	},
	clearDash : function(){
		var temct = this.refs.dashcanvas.getContext('2d');
		temct.clearRect(0,0,this.refs.dashcanvas.width,this.refs.dashcanvas.height);
		if(this.data.layerDashLineInterval){
			clearInterval(this.data.layerDashLineInterval);
			this.data.layerDashLineInterval = null;
		}
	},
    show:function(){
    	var file = AppStore.getActiveFile() || {};
    	var layers = file.layers || [];
    	var activeLayer = null;
    	layers.forEach(function(layer){
    		if(layer&&layer.active){
    			activeLayer = layer;
    		}
    	})
    	this.setState({
    		'show' : file.hasOwnProperty('id'),
    		'width' : file.width || 1,
    		'height' : file.height || 1,
    		'layers' : layers,
    		'activelayer' : activeLayer
    	});
    	this.paint();
    },
    hide:function(){
    	this.setState({show:false});
    },
	getInitialState : function(){
		return{
			'show' : false,
			'width' : 500,
			'height' : 500,
			'layers':[],
			'activelayer' :  null
		};
	},
	render:function(){
		var boxStyle = {display : this.state.show ? 'block':'none'};
		var style = {
			width : this.state.width+'px',
			height : this.state.height+'px'
		};
		return(	
			<div id='canvasBox' style={boxStyle}>
				<canvas id='paintcanvas' ref='paintcanvas' style={style} width={this.state.width} height={this.state.height}></canvas>
				<ActiveLayerCanvas activelayer={this.state.activelayer}/>
				<canvas id='dashcanvas' ref='dashcanvas' style={style} width={this.state.width} height={this.state.height}></canvas>
			</div>
		);
	}
})

var FileItem = React.createClass({
	fileActive:function(){
		if(!this.props.active){
			AppDispatcher.handleViewAction({
			    'name' : Constants.AT_DATA_FILE_ACTIVE,
			    'data' : {
			        'file_id' : this.props.fileId
			    }
			});
		}
	},
	fileClose : function(e){
		e.stopPropagation();
		AppDispatcher.handleViewAction({
		    'name' : Constants.AT_DATA_FILE_CLOSE,
		    'data' : {
		        'file_id' : this.props.fileId
		    }
		});
	},
	render : function(){
		var classes = 'fileitem'+(this.props.active?' active':'');
		return (
			<div className={classes} onClick={this.fileActive}>
				<p >{this.props.fileName+' ( '+this.props.fileWidth+'*'+this.props.fileHeight+' ) '}</p>
				<a className='fileitem_close' onClick={this.fileClose}></a>
			</div>
		)
	}
})

var FileList = React.createClass({
	mixins:[ListenerMixins],
	_listeners:[
	    Constants.AT_DATA_FILE_NEW,
	    Constants.AT_DATA_FILE_SELECT,
	    Constants.AT_DATA_FILE_ACTIVE,
	    Constants.AT_DATA_FILE_CLOSE,
	    Constants.AT_DATA_FILE_INFO
	],
	_callback:function(){
		var files = AppStore.getFiles();
		var activeFileID = AppStore.getActiveFileID();
		this.setState({
			'files' : files,
			'activeFileID' : activeFileID
		});
	},
	getInitialState:function() {
	    return {
	          'files' : [],
	          'activeFileID' : null
	    };
	},
	render : function(){
		var self = this;
		var nodes = [];
		this.state.files.forEach(function(file,index){
			nodes.push(<FileItem key={'file-'+index} fileName={file.fileName} fileWidth={file.width} 
				fileHeight={file.height} fileId={file.id} active={file.id == self.state.activeFileID} />);
		});
		return (
			<div id='filelist'>
				{nodes}
			</div>
		)
	}
})

var MainCanvas = React.createClass({
	render : function(){
		return (
			<div id='maincanvasBox'>
				<FileList />
				<div id='maincanvas'>
					<PaintCanvas />
				</div>
			</div>
		)
	}
})

module.exports = MainCanvas;
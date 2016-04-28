var React = require('react');

var Constants = require('../js/constants');
var Utils = require('../js/utils');

var ListenerMixins = require('../js/mixins/ListenerMixins');

var AppDispatcher = window.AppDispatcher;
var AppStore = window.AppStore;


var Layer = React.createClass({
    componentDidMount: function() {
        this.paint();
    },
    componentDidUpdate : function(prevProps,prevState){
        this.paint();
    },
    paint:function(){
        var ct = this.refs.canvas.getContext('2d');
        var scale ;
        if(this.props.file_height > this.props.file_width){
            scale = this.props.canvas_max_wh/this.props.file_height;
        }else{
            scale = this.props.canvas_max_wh/this.props.file_width;
        }

        ct.clearRect(0,0,this.refs.canvas.width,this.refs.canvas.height);

        if(this.props.layer.data){
            var temCanvas = Utils.imageDataToCanvas(this.props.layer.data);
            ct.drawImage(temCanvas,this.props.layer.left*scale,this.props.layer.top*scale,
                this.props.layer.width*scale,this.props.layer.height*scale);
        }
    },
    getDefaultProps : function(){
        return {
              'canvas_max_wh':40
        };
    },
    toggleShow:function(){
        AppDispatcher.handleViewAction({
            'name' : Constants.AT_DATA_LAYER_TOGGLE_SHOW,
            'data' : {
                'layer_id' : this.props.layer.id
            }
        });
    },
    active:function(){
        AppDispatcher.handleViewAction({
            'name' : Constants.AT_DATA_LAYER_ACTIVE,
            'data' : {
                'layer_id' : this.props.layer.id
            }
        });
    },
    nameClick:function(e){
        e.stopPropagation();
    },
    nameChange:function(e){
        AppDispatcher.handleViewAction({
            'name' : Constants.AT_DATA_LAYER_RENAME,
            'data' : {
                'layer_id' : this.props.layer.id,
                'new_name' : e.target.value
            }
        });
    },
    render:function(){
        var classes = 'layer' + (this.props.layer.show ? ' show':'')+(this.props.layer.active ? ' active':'');
        var height ,width;
        if( this.props.file_height > this.props.file_width ){
            height = this.props.canvas_max_wh;
            width = parseInt( (height/this.props.file_height)*this.props.file_width );
        }else{
            width = this.props.canvas_max_wh;
            height = parseInt( (width/this.props.file_width)*this.props.file_height );
        }

        var style = {
            'width': width+'px',
            'height':height+'px'
        };
        return (
            <div className={classes}>
                <a className='layer_toggle'  onClick={this.toggleShow}></a>
                <div className='layer_box' onClick={this.active}>
                    <canvas ref='canvas' style={style} width={width} height={height} className='layer_preview'></canvas>
                    <div className='layer_name_box'>
                        <input type="text" ref='name' className='layer_name' onClick={this.nameClick} onChange={this.nameChange} value={this.props.layer.name} /> 
                    </div>
                </div>    
            </div>
        );
    }
})


var Layers = React.createClass({
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
        Constants.AT_DATA_LAYER_RENAME,
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

        Constants.AT_TOOL_RECTANGLE_PAINTING,
        Constants.AT_TOOL_RECTANGLE_HANDLE,
        Constants.AT_TOOL_ELLIPSE_PAINTING,
        Constants.AT_TOOL_ELLIPSE_HANDLE,

        Constants.AT_DATA_PREV,
        Constants.AT_DATA_NEXT
    ],
    _callback:function(){
        this.updateView();  
    },
    getInitialState:function() {
        return {
              'layers':[]
        };
    },
    updateView:function(){
        var file = AppStore.getActiveFile() || {};
        var layers = file.layers || [];
        this.setState({
            'file_width':file.width || 1,
            'file_height':file.height || 1,
            'layers' : layers
        })
        // this.forceUpdate();
    },
    addLayer:function(){
        AppDispatcher.handleViewAction({
            'name':Constants.AT_DATA_LAYER_ADD
        })
    },
    delLayer:function(){
        AppDispatcher.handleViewAction({
            'name':Constants.AT_DATA_LAYER_DEL
        })
    },
    componentDidUpdate:function(){
        // $(".layers_container").scroll_absolute({arrows:true});
        // console.log('scroll_absolute')
        Ps.destroy(this.refs.layers_container);
        Ps.initialize(this.refs.layers_container);
    },
    // componentDidMount:function(){
    //     $(".layers_container").scroll_absolute({arrows:true});
    //     console.log('scroll_absolute')
    // },
	render : function(){
        var self = this;
        var nodes = [];
        this.state.layers.forEach(function(layer,index){
            nodes.push(<Layer key={'layer-'+index} layer={layer}
              file_width={self.state.file_width} file_height={self.state.file_height}   
            />)
        })
		return (
			<section id='layers'>
                <p className='layers_header'>图层</p>
                <div ref='layers_container' className='layers_container'>
                    {nodes}
                </div>
                <div className='layer_bottom'>
                    <a  className='layer_bottom_add' onClick={this.addLayer} title='新建图层'></a>
                    <a  className='layer_bottom_del' onClick={this.delLayer} title='删除图层'></a>
                </div>
            </section>
		);
	}
});

module.exports = Layers;
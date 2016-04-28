var React = require('react');

var Constants = require('../js/constants');
var Config = require('../js/config');


var AppDispatcher = window.AppDispatcher;
// var AppStore = window.AppStore;


var Palette = React.createClass({
	componentDidMount: function() {
		AppStore.addChangeListener(Constants.AT_DATA_COLOR,this.listener);

		var self = this;
		var img = new Image();
    // img.crossOrigin = "Anonymous";
		img.src = './src/img/palette.jpg';
		img.onload = function(){
			var ct = self.refs.canvas.getContext('2d');
			ct.drawImage(img,0,0,self.state.canvas_width,self.state.canvas_height);
		}
	},
  componentWillUnmount: function() {
  	AppStore.removeChangeListener(Constants.AT_DATA_COLOR,this.listener);
  },
  listener:function( ){
    var rgb = AppStore.getConfig('color');
    var t = this.state;
    if(rgb[0] != t.r || rgb[1] != t.g || rgb[2] != t.b){
        var newState = {
            'r':rgb[0],
            'g':rgb[1],
            'b':rgb[2],
        };
        newState.hex = this.RGBToHex(newState);
        this.setState(newState);
    }
  }, 
 	getInitialState:function() {
      var state = {
        'r': Config.Color[0],
        'g': Config.Color[1],
        'b': Config.Color[2],
        'canvas_width':200,  
        'canvas_height':200,
        'palette_active':false  
      };
      state.hex = this.RGBToHex(state);
 	    return state;
 	},
  handleChange:function(ref,e){
    switch(ref){
      case 'hex':
            var res = this.judgeHex(e.target.value);
            if(res){
                var text = res[0];
                var newState = {'hex':text};

                var rgb = this.hexToRGB(text) ;
                if(rgb){
                  newState.r = rgb[0];
                  newState.g = rgb[1];
                  newState.b = rgb[2];
                  this.dispatch(rgb);
                }
                this.setState(newState);
            }
            break;
      case 'r':
      case 'g':
      case 'b':
            var res = this.judgeRGB(e.target.value);
            if(res !== false){
                var newState = {
                  'r':this.state.r,
                  'g':this.state.g,
                  'b':this.state.b,
                };
                newState[ref] = res;
                newState.hex = this.RGBToHex(newState);

                this.setState(newState);

                this.dispatch([newState.r,newState.g,newState.b]);
            }
            break;
    }
  },
  judgeHex:function(hex){
    var reg = /^[0-9a-fA-F]{0,6}$/;
    return reg.exec(hex);
  },
  judgeRGB:function(arg){
    if(arg == ''){
      return 0;
    }
    arg = parseInt(arg, 10);
    if(arg >= 0 && arg <= 255){
      return arg;
    }else{
      return false;
    }
  },
  hexToRGB:function(hex){
    var res ;
    if(hex.length == 3){
      res = [ 
              parseInt(hex[0]+hex[0], 16),
              parseInt(hex[1]+hex[1], 16),
              parseInt(hex[2]+hex[2], 16),
             ];
    }else if(hex.length == 6){
      res = [ 
              parseInt(hex[0]+hex[1], 16),
              parseInt(hex[2]+hex[3], 16),
              parseInt(hex[4]+hex[5], 16),
             ];
    }else{
      res = null;
    }

    return res;
  },
  RGBToHex:function(obj){
    var r,g,b;
    r = obj.r.toString(16);
    g = obj.g.toString(16);
    b = obj.b.toString(16);
    r.length == 1 && (r = '0' + r);
    g.length == 1 && (g = '0' + g);
    b.length == 1 && (b = '0' + b);
    return r+g+b;
  },
  dispatch:function(arr){
    AppDispatcher.handleViewAction({
       'name' : Constants.AT_DATA_COLOR,
       'data' : arr
    });
  },
  handleMouseDown:function(e){
    this.setState({
      'palette_active':true
    });
    this.getPixel(e);
  },
  handleMouseUp:function(e){
    this.setState({
      'palette_active':false
    })
  },
  handleMouseMove:function(e){
    if(!this.state.palette_active){
      return ;
    }
    this.getPixel(e);
  },
  handleMouseOut:function(e){
    this.setState({
      'palette_active':false
    })
  },
  getPixel :function(e){
      var target = e.target;
      var x = e.clientX - target.getBoundingClientRect().left,
          y = e.clientY - target.getBoundingClientRect().top;
      var ct = this.refs.canvas.getContext('2d');
      var pixel = ct.getImageData(x,y,1,1);
      // console.log(pixel);
      this.dispatch(pixel.data.slice(0,3))
  },
	render : function(){
    var rgb = 'rgb('+[this.state.r,this.state.g,this.state.b].join(',')+')';
		return (
			<section id='palette'>
  				<p className='palette_header'>颜色</p>
  				<div className='palette_top'>
  					<div className='palette_b'>
  						<span className='palette_color' style={{'backgroundColor':rgb}}></span>
  					</div>
  					<div className='palette_item palette_color_hex'>
  						#<input ref='hex' type='text' placeholder='000000 ~ ffffff' value={this.state.hex} onChange={this.handleChange.bind(this,'hex')}/>
  					</div>
  					<div className='palette_item'>
  						R<input ref='r' type='text' placeholder='0 ~ 255' value={this.state.r} onChange={this.handleChange.bind(this,'r')}/>
  					</div>
  					<div className='palette_item'>
  						G<input ref='g' type='text' placeholder='0 ~ 255' value={this.state.g} onChange={this.handleChange.bind(this,'g')}/>
  					</div>
  					<div className='palette_item'>
  						B<input ref='b' type='text' placeholder='0 ~ 255' value={this.state.b} onChange={this.handleChange.bind(this,'b')}/>
  					</div>
  				</div>
  				<div className='palette_bottom'>
  					<canvas ref='canvas' id='palette_canvas' width={this.state.canvas_width} height={this.state.canvas_height} ></canvas>
            <div className='palette_fake' style={{width:this.state.canvas_width,height:this.state.canvas_height}}
            onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp} 
            onMouseMove={this.handleMouseMove} onMouseOut={this.handleMouseOut}>
            </div>
  				</div>	
            </section>
		);
	}
});

module.exports = Palette;
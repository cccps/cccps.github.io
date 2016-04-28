var AppDispatcher = window.AppDispatcher;
var AppStore = window.AppStore;
// var Config = require('../config');
var Constants = require('../constants');
var Utils = require('../utils');

var Strategy = {};

Strategy.load = function(strategy,canvas){
	this[strategy].load(canvas);
}

Strategy.unload = function(strategy){
	this[strategy].unload();
}

Strategy.move = {
	'data':{
		'canvas' : null,
		'bounding ': null,
		'down' : false,
		'startX' : null,
		'startY' : null
	},
	'mouseDown':function(e){
		var self = Strategy.move;
		self.data.down = true;
		self.data.bounding = self.data.canvas.getBoundingClientRect();
		self.data.startX = e.clientX - self.data.bounding.left;
		self.data.startY = e.clientY - self.data.bounding.top;
		AppDispatcher.handleViewAction({
			'name': Constants.AT_TOOL_MOVE,
			'data':{
				'startX' : self.data.startX,
				'startY' : self.data.startY,
				'deltaX' : 0,
				'deltaY' : 0
			}
		})
		// console.log(this.data.startX,this.data.startY);
	},
	'mouseMove':function(e){
		var self = Strategy.move;

		if(!self.data.down){
			return ;
		}
		var x = e.clientX - self.data.bounding.left,
			y = e.clientY - self.data.bounding.top;
		var deltaX = x - self.data.startX,
			deltaY = y - self.data.startY;

		// console.log(deltaX,deltaY);

		AppDispatcher.handleViewAction({
			'name': Constants.AT_TOOL_MOVE,
			'data':{
				'startX' : self.data.startX,
				'startY' : self.data.startY,
				'deltaX' : deltaX,
				'deltaY' : deltaY
			}
		})

		self.data.startX = x;
		self.data.startY = y;

	},
	'mouseUp':function(e){
		var self = Strategy.move;
		if(!self.data.down){
			return ;
		}
		self.data.down = false;
		AppDispatcher.handleViewAction({
			'name': Constants.AT_TOOL_MOVE_UP,
		})
	},
	'mouseOut':function(e){
		var self = Strategy.move;
		if(!self.data.down){
			return ;
		}
		self.data.down = false;
		AppDispatcher.handleViewAction({
			'name': Constants.AT_TOOL_MOVE_UP,
		})
	},

	'load':function(canvas){
		// console.log('fn_move_load')
		this.data.canvas = canvas;
		canvas.addEventListener('mousedown',this.mouseDown,false);
		canvas.addEventListener('mousemove',this.mouseMove,false);
		canvas.addEventListener('mouseup',this.mouseUp,false);
		canvas.addEventListener('mouseout',this.mouseOut,false);
	},
	'unload':function(){
		// console.log('fn_move_unload')
		this.data.canvas.removeEventListener('mousedown',this.mouseDown,false);
		this.data.canvas.removeEventListener('mousemove',this.mouseMove,false);
		this.data.canvas.removeEventListener('mouseup',this.mouseUp,false);
		this.data.canvas.removeEventListener('mouseout',this.mouseOut,false);
	}
}

var sameStrategy = {
	'data':{
		'canvas' : null,
		'bounding ': null,
		'down' : false,
		'fn':{},
		'actions':{}
	},
	'mouseDown':function(e){
		this.data.down = true;
		this.data.bounding = this.data.canvas.getBoundingClientRect();
		var x = e.clientX - this.data.bounding.left;
		var y = e.clientY - this.data.bounding.top;
		AppDispatcher.handleViewAction({
			'name': this.data.actions.down,
			'data':{
				'x' : x,
				'y' : y
			}
		})
	},
	'mouseMove':function(e){

		if(!this.data.down){
			return ;
		}
		var x = e.clientX - this.data.bounding.left,
			y = e.clientY - this.data.bounding.top;


		AppDispatcher.handleViewAction({
			'name': this.data.actions.move,
			'data':{
				'x' : x,
				'y' : y
			}
		})
	},
	'mouseUp':function(e){
		if(!this.data.down){
			return ;
		}
		this.data.down = false;
		AppDispatcher.handleViewAction({
			'name': this.data.actions.up,
		})
	},
	'mouseOut':function(e){
		if(!this.data.down){
			return ;
		}
		this.data.down = false;
		AppDispatcher.handleViewAction({
			'name': this.data.actions.out,
		})
	},
	'load':function(canvas){
		this.data.canvas = canvas;
		this.data.fn.down = this.mouseDown.bind(this);
		this.data.fn.move = this.mouseMove.bind(this);
		this.data.fn.up = this.mouseUp.bind(this);
		this.data.fn.out = this.mouseOut.bind(this);
		canvas.addEventListener('mousedown',this.data.fn.down,false);
		canvas.addEventListener('mousemove',this.data.fn.move,false);
		canvas.addEventListener('mouseup',this.data.fn.up,false);
		canvas.addEventListener('mouseout',this.data.fn.out,false);
	},
	'unload':function(){
		this.data.canvas.removeEventListener('mousedown',this.data.fn.down,false);
		this.data.canvas.removeEventListener('mousemove',this.data.fn.move,false);
		this.data.canvas.removeEventListener('mouseup',this.data.fn.up,false);
		this.data.canvas.removeEventListener('mouseout',this.data.fn.out,false);
	}
}

Strategy.pencil = Utils.deepClone(sameStrategy);
Strategy.rubber = Utils.deepClone(sameStrategy);
Strategy.pencil.data.actions = Strategy.rubber.data.actions = {
	'down':Constants.AT_TOOL_DRAW,
	'move':Constants.AT_TOOL_DRAW,
	'up':Constants.AT_TOOL_DRAW_UP,
	'out':Constants.AT_TOOL_DRAW_UP
}

Strategy.pick = {
	'data':{
		'canvas':null,
		'down' : false
	},
	getPixel : function(e){
		var x = e.clientX - this.data.canvas.getBoundingClientRect().left,
		    y = e.clientY - this.data.canvas.getBoundingClientRect().top;
		var ct = this.data.canvas.getContext('2d');
		var pixel = ct.getImageData(x,y,1,1);
		// console.log(pixel.data.slice(0,4));
		if(pixel.data[3]!=0){
			AppDispatcher.handleViewAction({
				'name': Constants.AT_DATA_COLOR,
				'data':pixel.data.slice(0,3)
			})	
		}
	},
	'mouseDown':function(e){
		var self = Strategy.pick;
		self.data.down = true;
		self.getPixel(e);
	},
	'mouseMove':function(e){
		var self = Strategy.pick;

		if(!self.data.down){
			return ;
		}
		self.getPixel(e);
	},
	'mouseUp':function(e){
		var self = Strategy.pick;
		self.data.down = false;
	},
	'mouseOut':function(e){
		var self = Strategy.pick;
		self.data.down = false;
	},
	'load':function(canvas){
		// console.log('fn_pick_load')
		this.data.canvas = canvas;
		canvas.addEventListener('mousedown',this.mouseDown,false);
		canvas.addEventListener('mousemove',this.mouseMove,false);
		canvas.addEventListener('mouseup',this.mouseUp,false);
		canvas.addEventListener('mouseout',this.mouseOut,false);
	},
	'unload':function(){
		// console.log('fn_pick_unload')
		this.data.canvas.removeEventListener('mousedown',this.mouseDown,false);
		this.data.canvas.removeEventListener('mousemove',this.mouseMove,false);
		this.data.canvas.removeEventListener('mouseup',this.mouseUp,false);
		this.data.canvas.removeEventListener('mouseout',this.mouseOut,false);
	}
}

Strategy.line = Utils.deepClone(sameStrategy);
Strategy.line.data.actions = {
	'down':Constants.AT_TOOL_LINE,
	'move':Constants.AT_TOOL_LINE,
	'up':Constants.AT_TOOL_LINE_UP,
	'out':Constants.AT_TOOL_LINE_UP
}

Strategy.rectangle = Utils.deepClone(sameStrategy);
Strategy.rectangle.data.actions = {
	'down':Constants.AT_TOOL_RECTANGLE,
	'move':Constants.AT_TOOL_RECTANGLE,
	'up':Constants.AT_TOOL_RECTANGLE_UP,
	'out':Constants.AT_TOOL_RECTANGLE_UP
}

Strategy.ellipse = Utils.deepClone(sameStrategy);
Strategy.ellipse.data.actions = {
	'down':Constants.AT_TOOL_ELLIPSE,
	'move':Constants.AT_TOOL_ELLIPSE,
	'up':Constants.AT_TOOL_ELLIPSE_UP,
	'out':Constants.AT_TOOL_ELLIPSE_UP
}

module.exports = Strategy;

window.Strategy = Strategy;